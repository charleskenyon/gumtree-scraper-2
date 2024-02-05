import { Stack, StackProps, Tags, RemovalPolicy } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import {
  DbIteratorLambdaConstruct,
  QueryScraperLambdaConstruct,
  EmailNotificationLambdaConstruct,
} from './constructs';
import {
  QUERY_TABLE_NAME,
  LISTINGS_TABLE_NAME,
} from '../../src/opt/nodejs/constants';

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
      tableName: QUERY_TABLE_NAME,
    });

    const listingTable = new dynamodb.Table(this, 'ListingsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      tableName: LISTINGS_TABLE_NAME,
      stream: dynamodb.StreamViewType.NEW_IMAGE,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const lambdaS3Bucket = s3.Bucket.fromBucketName(
      this,
      'LambdaS3Bucket',
      lambdaS3BucketName
    );

    const optLambdaLayer = new lambda.LayerVersion(this, 'OptLambdaLayer', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      code: lambda.Code.fromBucket(lambdaS3Bucket, optS3Key),
    });

    const queryScraperQueue = new sqs.Queue(this, 'QueryScraperQueue', {
      queueName: `${scraperName}-queue`,
    });

    const { dbIteratorLambdaRole } = new DbIteratorLambdaConstruct(
      this,
      'DbIteratorLambdaConstruct',
      {
        scraperName,
        queryTable,
        lambdaS3Bucket,
        optLambdaLayer,
        queryScraperQueue,
      }
    );

    const { queryScraperLambdaRole } = new QueryScraperLambdaConstruct(
      this,
      'QueryScraperLambdaConstruct',
      {
        scraperName,
        listingTable,
        lambdaS3Bucket,
        optLambdaLayer,
        queryScraperQueue,
      }
    );

    new EmailNotificationLambdaConstruct(
      this,
      'EmailNotificationLambdaConstruct',
      {
        scraperName,
        listingTable,
        lambdaS3Bucket,
        optLambdaLayer,
      }
    );

    queryScraperQueue.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ArnPrincipal(dbIteratorLambdaRole.roleArn)],
        actions: ['sqs:SendMessage'],
        resources: [queryScraperQueue.queueArn],
      })
    );

    queryScraperQueue.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ArnPrincipal(queryScraperLambdaRole.roleArn)],
        actions: ['sqs:DeleteMessage'],
        resources: [queryScraperQueue.queueArn],
      })
    );

    Tags.of(this).add('Application', 'Gumtree Scraper');
  }
}
