import { Handler } from 'aws-lambda';
import { getFormattedDynamoDbItems } from '/opt/nodejs/utils';
import { AWS, QUERY_TABLE_NAME } from '/opt/nodejs/constants';
import { QueryItem } from '/opt/nodejs/types';

export const handler: Handler = async (): Promise<string> => {
  const queriesData = await new AWS.DynamoDB()
    .scan({ TableName: QUERY_TABLE_NAME })
    .promise();
  const queries = getFormattedDynamoDbItems<QueryItem>(queriesData);
  console.log(queries, 'UPDATE');
  return queries.toString();
};

// https://www.gumtree.com/search?search_category=all&q=2+bed+flat=&search_location=London
