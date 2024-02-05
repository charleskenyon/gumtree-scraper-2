import R from 'ramda';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import type { DynamoDBStreamEvent } from 'aws-lambda';
import type { AttributeValue } from '@aws-sdk/client-dynamodb';
import { SendEmailResponse } from '@aws-sdk/client-ses';
import { ListingItem } from '/opt/nodejs/types';
import { sendEmails } from './lib';

export const handler = async (
  event: DynamoDBStreamEvent
): Promise<SendEmailResponse[]> => {
  const { Records: records } = event;

  const insertRecords = records.filter(
    ({ eventName }) => eventName === 'INSERT'
  );

  const listings = insertRecords.map(
    ({ dynamodb: { NewImage } }) =>
      unmarshall(NewImage as Record<string, AttributeValue>) as ListingItem
  );

  const uniqueEmails = R.pipe(
    R.map(R.prop('emails')),
    R.flatten,
    R.uniq
  )(listings);

  return sendEmails(uniqueEmails, listings);
};
