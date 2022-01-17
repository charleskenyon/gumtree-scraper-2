import R from 'ramda';
import { Handler } from 'aws-lambda';
import { AWS, QUERY_TABLE_NAME } from '/opt/nodejs/constants';
import { QueryItem } from '/opt/nodejs/types';

const getFormattedQueries = R.pipe(
  R.prop('Items'),
  R.map(AWS.DynamoDB.Converter.unmarshall)
) as (data: AWS.DynamoDB.ScanOutput) => QueryItem[];

export const handler: Handler = async (): Promise<string> => {
  const queriesData = await new AWS.DynamoDB()
    .scan({ TableName: QUERY_TABLE_NAME })
    .promise();
  const queries = getFormattedQueries(queriesData);
  console.log(queries);
  return queries.toString();
};

// https://www.gumtree.com/search?search_category=all&q=2+bed+flat=&search_location=London
