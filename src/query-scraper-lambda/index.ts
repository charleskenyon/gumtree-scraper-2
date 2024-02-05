import R from 'ramda';
import axios from 'axios';
import type { SQSEvent } from 'aws-lambda';
import { PutItemOutput } from '@aws-sdk/client-dynamodb';
import {
  formatRequestUrl,
  extractData,
  postListingsItems,
  deleteMessage,
} from './lib';
import { QueryItem } from '/opt/nodejs/types';

export const handler = async (event: SQSEvent): Promise<PutItemOutput[]> => {
  const {
    Records: [{ body, receiptHandle }],
  } = event;
  const queryItem: QueryItem = JSON.parse(body);
  const gumtreeRequestUrl = formatRequestUrl(R.dissoc('emails', queryItem));
  const response = await axios.get(gumtreeRequestUrl);
  const listingsData = extractData(response.data);
  const postResponse = await postListingsItems({
    listingsData,
    emails: queryItem.emails,
  });
  receiptHandle && (await deleteMessage(receiptHandle));
  return postResponse;
};
