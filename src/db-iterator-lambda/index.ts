import AWS from 'aws-sdk';
import { Handler } from 'aws-lambda';

AWS.config.update({
  region: 'eu-west-2',
  maxRetries: 3,
});

export const handler: Handler = async (): Promise<string> => {
  const val = await new AWS.DynamoDB({ apiVersion: '2012-08-10' })
    .scan({ TableName: 'queryTable' })
    .promise();
  console.log('test fingerprinting', val);
  return val.toString();
};

// https://www.gumtree.com/search?search_category=all&q=2+bed+flat=&search_location=London
