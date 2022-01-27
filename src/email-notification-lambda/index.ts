import R from 'ramda';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { AWS } from '/opt/nodejs/constants';
import { ListingItem } from '/opt/nodejs/types';
import { sendEmails } from './lib';

export const handler = async (
  event: DynamoDBStreamEvent
): Promise<AWS.SES.SendEmailResponse[]> => {
  const { Records: records } = event;

  const insertRecords = records.filter(
    ({ eventName }) => eventName === 'INSERT'
  );

  const listings = insertRecords.map(
    ({ dynamodb: { NewImage } }) =>
      AWS.DynamoDB.Converter.unmarshall(NewImage) as ListingItem
  );

  const uniqueEmails = R.pipe(
    R.map(R.prop('emails')),
    R.flatten,
    R.uniq
  )(listings);

  return sendEmails(uniqueEmails, listings);
};
