import { Duration, StackProps } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as events from 'aws-cdk-lib/aws-events';
import * as eventsTargets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

interface DbIteratorLambdaConstructStackProps extends StackProps {
  readonly scraperName: string;
  readonly queryTable: dynamodb.ITable;
  readonly lambdaS3Bucket: s3.IBucket;
  readonly optLambdaLayer: lambda.ILayerVersion;
  readonly queryScraperQueue: sqs.IQueue;
}

export default class DbIteratorLambdaConstruct extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: DbIteratorLambdaConstructStackProps
  ) {
    super(scope, id);

    const dbIteratorLambdaName = 'db-iterator-lambda';
    const dbIteratorLambdaS3Key = this.node.tryGetContext(
      'dbIteratorLambdaS3Key'
    );
    const queueUrl = this.node.tryGetContext('queueUrl');

    const dbIteratorLambdaRole = new iam.Role(this, 'DbIteratorLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole'
        ),
      ],
      roleName: `${props.scraperName}-${dbIteratorLambdaName}-role`,
    });

    dbIteratorLambdaRole.addToPolicy(
      new iam.PolicyStatement({
        resources: [props.queryTable.tableArn],
        actions: ['dynamodb:Scan'],
      })
    );

    dbIteratorLambdaRole.addToPolicy(
      new iam.PolicyStatement({
        resources: [props.queryScraperQueue.queueArn],
        actions: ['sqs:SendMessageBatch'],
      })
    );

    const dbIteratorLambda = new lambda.Function(this, `DbIteratorLambda`, {
      functionName: `${props.scraperName}-${dbIteratorLambdaName}`,
      code: lambda.Code.fromBucket(props.lambdaS3Bucket, dbIteratorLambdaS3Key),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      reservedConcurrentExecutions: 1,
      role: dbIteratorLambdaRole,
      environment: {
        QUEUE_URL: queueUrl,
      },
      layers: [props.optLambdaLayer],
    });

    new events.Rule(this, 'DbIteratorLambdaScheduler', {
      schedule: events.Schedule.rate(Duration.minutes(5)),
      ruleName: `${props.scraperName}-${dbIteratorLambdaName}-scheduler`,
      enabled: false,
      targets: [new eventsTargets.LambdaFunction(dbIteratorLambda)],
    });
  }
}
