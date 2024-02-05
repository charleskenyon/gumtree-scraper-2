import R from 'ramda';
import { v4 as uuidv4 } from 'uuid';
import {
  SendMessageBatchCommand,
  SendMessageBatchResult,
} from '@aws-sdk/client-sqs';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { getFormattedDynamoDbItems } from '/opt/nodejs/utils';
import { AWS, QUERY_TABLE_NAME, QUEUE_URL } from '/opt/nodejs/constants';
import { QueryItem } from '/opt/nodejs/types';

export const handler = async (): Promise<SendMessageBatchResult[]> => {
  const queriesData = await AWS.dynamoDbClient.send(
    new ScanCommand({ TableName: QUERY_TABLE_NAME })
  );

  const queries = getFormattedDynamoDbItems<QueryItem>(queriesData);
  const batchedQueries = R.splitEvery(10, queries);

  return Promise.all(
    batchedQueries.map((queries) =>
      AWS.sqsClient.send(
        new SendMessageBatchCommand({
          QueueUrl: QUEUE_URL,
          Entries: queries.map((query) => ({
            Id: uuidv4(),
            MessageBody: JSON.stringify(query),
          })),
        })
      )
    )
  );
};
