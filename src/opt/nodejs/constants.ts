import { SQSClient } from '@aws-sdk/client-sqs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SESClient } from '@aws-sdk/client-ses';

const AWS = {
  sqsClient: new SQSClient({ region: 'eu-west-2' }),
  dynamoDbClient: new DynamoDBClient({ region: 'eu-west-2' }),
  sesClient: new SESClient({ region: 'eu-west-2' }),
};

const QUEUE_URL = process.env.QUEUE_URL;

const QUERY_TABLE_NAME = 'queryTable';

const LISTINGS_TABLE_NAME = 'listingsTable';

const GUMTREE_URL = 'https://www.gumtree.com';

export {
  SQSClient,
  QUEUE_URL,
  QUERY_TABLE_NAME,
  LISTINGS_TABLE_NAME,
  GUMTREE_URL,
  AWS,
};
