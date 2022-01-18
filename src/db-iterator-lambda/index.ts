import R from 'ramda';
import { v4 as uuidv4 } from 'uuid';
import { getFormattedDynamoDbItems } from '/opt/nodejs/utils';
import { AWS, QUERY_TABLE_NAME } from '/opt/nodejs/constants';
import { QueryItem } from '/opt/nodejs/types';

const { QUEUE_URL } = process.env;
const dynamoDb = new AWS.DynamoDB();
const sqs = new AWS.SQS();

export const handler = async (): Promise<AWS.SQS.SendMessageBatchResult[]> => {
  const queriesData = await dynamoDb
    .scan({ TableName: QUERY_TABLE_NAME })
    .promise();

  const queries = getFormattedDynamoDbItems<QueryItem>(queriesData);
  const batchedQueries = R.splitEvery(10, queries);

  return Promise.all(
    batchedQueries.map((queries) =>
      sqs
        .sendMessageBatch({
          QueueUrl: QUEUE_URL,
          Entries: queries.map((query) => ({
            Id: uuidv4(),
            MessageBody: JSON.stringify(query),
          })),
        })
        .promise()
    )
  );
};
