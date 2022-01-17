import R from 'ramda';
import { AWS } from './constants';

const getFormattedDynamoDbItems = R.pipe(
  R.prop('Items'),
  R.map(AWS.DynamoDB.Converter.unmarshall)
) as <T>(data: AWS.DynamoDB.ScanOutput) => T[];

export { getFormattedDynamoDbItems };
