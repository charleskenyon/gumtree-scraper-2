import { Duration, Stack, StackProps, Tags } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as eventsTargets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export class GumtreeScraperStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const scraperName = 'gumtree-scraper';
    const dbIteratorLambdaName = 'db-iterator-lambda';
    const lambdaS3BucketName = this.node.tryGetContext('lambdaS3Bucket');
    const dbIteratorLambdaS3Key = this.node.tryGetContext(
      'dbIteratorLambdaS3Key'
    );

    const lambdaS3Bucket = s3.Bucket.fromBucketName(
      this,
      'LambdaS3Bucket',
      lambdaS3BucketName
    );

    const dbIteratorLambda = new lambda.Function(this, `DbIteratorLambda`, {
      functionName: `${scraperName}-${dbIteratorLambdaName}`,
      code: lambda.Code.fromBucket(lambdaS3Bucket, dbIteratorLambdaS3Key),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      reservedConcurrentExecutions: 1,
    });

    new events.Rule(this, 'DbIteratorLambdaScheduler', {
      schedule: events.Schedule.rate(Duration.minutes(5)),
      ruleName: `${scraperName}-${dbIteratorLambdaName}-scheduler`,
      enabled: false,
      targets: [new eventsTargets.LambdaFunction(dbIteratorLambda)],
    });

    Tags.of(this).add('Application', 'Gumtree Scraper');
  }
}
