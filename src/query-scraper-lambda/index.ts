import R from 'ramda';
import axios from 'axios';
import { SQSEvent } from 'aws-lambda';
import {
  formatRequestUrl,
  extractData,
  postListingsItems,
  deleteMessage,
} from './lib';
import { AWS } from '/opt/nodejs/constants';
import { QueryItem } from '/opt/nodejs/types';

export const handler = async (
  event: SQSEvent
): Promise<AWS.DynamoDB.PutItemOutput[]> => {
  const {
    Records: [{ body, receiptHandle }],
  } = event;
  console.log(typeof body, body, Object.keys(body), JSON.parse(body));
  const queryItem: QueryItem = JSON.parse(body);
  const gumtreeRequestUrl = formatRequestUrl(R.dissoc('emails', queryItem));
  const response = await axios.get(gumtreeRequestUrl);
  const listingsData = extractData(response.data);
  console.log(listingsData);
  const postResponse = await postListingsItems({
    listingsData,
    emails: queryItem.emails,
  });
  await deleteMessage(receiptHandle);
  return postResponse;
};
