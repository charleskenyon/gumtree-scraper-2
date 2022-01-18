import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import {
  DbIteratorLambdaConstruct,
  QueryScraperLambdaConstruct,
} from './constructs';

export class GumtreeScraperStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const scraperName = 'gumtree-scraper';
    const lambdaS3BucketName = this.node.tryGetContext('lambdaS3Bucket');
    const optS3Key = this.node.tryGetContext('optS3Key');

    const queryTable = new dynamodb.Table(this, 'QueryTable', {
      partitionKey: { name: 'query', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      tableName: 'queryTable',
    });

    const lambdaS3Bucket = s3.Bucket.fromBucketName(
      this,
      'LambdaS3Bucket',
      lambdaS3BucketName
    );

    const optLambdaLayer = new lambda.LayerVersion(this, 'OptLambdaLayer', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
      code: lambda.Code.fromBucket(lambdaS3Bucket, optS3Key),
    });

    const queryScraperQueue = new sqs.Queue(this, 'QueryScraperQueue', {
      queueName: `${scraperName}-queue`,
    });

    new DbIteratorLambdaConstruct(this, 'DbIteratorLambdaConstruct', {
      scraperName,
      queryTable,
      lambdaS3Bucket,
      optLambdaLayer,
      queryScraperQueue,
    });

    new QueryScraperLambdaConstruct(this, 'QueryScraperLambdaConstruct', {
      scraperName,
      queryTable,
      lambdaS3Bucket,
      optLambdaLayer,
      queryScraperQueue,
    });

    Tags.of(this).add('Application', 'Gumtree Scraper');
  }
}

// AWSLambdaDynamoDBExecutionRole
// AWSLambdaSQSQueueExecutionRole
