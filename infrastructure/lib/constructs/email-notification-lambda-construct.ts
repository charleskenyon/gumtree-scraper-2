import { StackProps, Stack } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';

interface EmailNotificationLambdaConstructStackProps extends StackProps {
  readonly scraperName: string;
  readonly listingTable: dynamodb.ITable;
  readonly lambdaS3Bucket: s3.IBucket;
  readonly optLambdaLayer: lambda.ILayerVersion;
}

export default class EmailNotificationLambdaConstruct extends Construct {
  public dbIteratorLambdaRole: iam.IRole;

  constructor(
    scope: Construct,
    id: string,
    props: EmailNotificationLambdaConstructStackProps
  ) {
    super(scope, id);

    const emailNotificationLambdaName = 'email-notification-lambda';
    const emailNotificationLambdaS3Key = this.node.tryGetContext(
      'emailNotificationLambdaS3Key'
    );

    const emailNotificationLambdaRole = new iam.Role(
      this,
      'EmailNotificationLambdaRole',
      {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            'service-role/AWSLambdaBasicExecutionRole'
          ),
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            'service-role/AWSLambdaDynamoDBExecutionRole'
          ),
        ],
        roleName: `${props.scraperName}-${emailNotificationLambdaName}-role`,
      }
    );

    emailNotificationLambdaRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: [
          `arn:aws:ses:eu-west-2:${Stack.of(this).account}:identity/*`,
        ],
      })
    );

    const emailNotificationLambda = new lambda.Function(
      this,
      `EmailNotificationLambda`,
      {
        functionName: `${props.scraperName}-${emailNotificationLambdaName}`,
        code: lambda.Code.fromBucket(
          props.lambdaS3Bucket,
          emailNotificationLambdaS3Key
        ),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        reservedConcurrentExecutions: 5,
        role: emailNotificationLambdaRole,
        layers: [props.optLambdaLayer],
      }
    );

    emailNotificationLambda.addEventSource(
      new DynamoEventSource(props.listingTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        batchSize: 10,
        bisectBatchOnError: true,
        retryAttempts: 3,
      })
    );

    props.listingTable.grantStreamRead(emailNotificationLambda);
  }
}
