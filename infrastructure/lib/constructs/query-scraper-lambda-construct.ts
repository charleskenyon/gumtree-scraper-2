import { StackProps } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';

interface QueryScraperLambdaConstructStackProps extends StackProps {
  readonly scraperName: string;
  readonly listingTable: dynamodb.ITable;
  readonly lambdaS3Bucket: s3.IBucket;
  readonly optLambdaLayer: lambda.ILayerVersion;
  readonly queryScraperQueue: sqs.IQueue;
}

export default class QueryScraperLambdaConstruct extends Construct {
  readonly queryScraperLambdaRole: iam.IRole;
  constructor(
    scope: Construct,
    id: string,
    props: QueryScraperLambdaConstructStackProps
  ) {
    super(scope, id);

    const queryScraperLambdaName = 'query-scraper-lambda';
    const queryScraperLambdaS3Key = this.node.tryGetContext(
      'queryScraperLambdaS3Key'
    );

    const queryScraperLambdaRole = new iam.Role(
      this,
      'QueryScraperLambdaRole',
      {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            'service-role/AWSLambdaBasicExecutionRole'
          ),
        ],
        roleName: `${props.scraperName}-${queryScraperLambdaName}-role`,
      }
    );

    queryScraperLambdaRole.addToPolicy(
      new iam.PolicyStatement({
        resources: [props.listingTable.tableArn],
        actions: ['dynamodb:PutItem'],
      })
    );

    queryScraperLambdaRole.addToPolicy(
      new iam.PolicyStatement({
        resources: [props.queryScraperQueue.queueArn],
        actions: ['sqs:DeleteMessage'],
      })
    );

    const queryScraperLambda = new lambda.Function(this, `QueryScraperLambda`, {
      functionName: `${props.scraperName}-${queryScraperLambdaName}`,
      code: lambda.Code.fromBucket(
        props.lambdaS3Bucket,
        queryScraperLambdaS3Key
      ),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      reservedConcurrentExecutions: 1,
      role: queryScraperLambdaRole,
      layers: [props.optLambdaLayer],
    });

    queryScraperLambda.addEventSource(
      new SqsEventSource(props.queryScraperQueue, {
        batchSize: 1,
      })
    );

    this.queryScraperLambdaRole = queryScraperLambdaRole;
  }
}
