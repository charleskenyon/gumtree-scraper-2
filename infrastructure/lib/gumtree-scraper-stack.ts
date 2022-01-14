import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { DbIteratorLambdaConstruct } from './constructs/db-iterator-lambda-construct';

export class GumtreeScraperStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const scraperName = 'gumtree-scraper';
    const lambdaS3BucketName = this.node.tryGetContext('lambdaS3Bucket');

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

    new DbIteratorLambdaConstruct(this, 'DbIteratorLambdaConstruct', {
      scraperName,
      queryTable,
      lambdaS3Bucket,
    });

    Tags.of(this).add('Application', 'Gumtree Scraper');
  }
}

// AWSLambdaDynamoDBExecutionRole
// AWSLambdaSQSQueueExecutionRole
