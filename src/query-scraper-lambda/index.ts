import axios from 'axios';
import { SQSEvent } from 'aws-lambda';
import { formatRequestUrl, extractData, postListingsItems } from './lib';
import { AWS, QUEUE_URL } from '/opt/nodejs/constants';
import { QueryItem } from '/opt/nodejs/types';

const sqs = new AWS.SQS();

const deleteMessage = (receiptHandle: string) =>
  sqs
    .deleteMessage({ QueueUrl: QUEUE_URL, ReceiptHandle: receiptHandle })
    .promise();

export const handler = async (
  event: SQSEvent
): Promise<AWS.DynamoDB.PutItemOutput[]> => {
  const {
    Records: [{ body, receiptHandle }],
  } = event;
  const queryItem: QueryItem = JSON.parse(body);
  const gumtreeRequestUrl = formatRequestUrl(queryItem);
  const response = await axios.get(gumtreeRequestUrl);
  const listingsData = extractData(response.data);
  const postResponse = await postListingsItems({
    listingsData,
    emails: queryItem.emails,
  });
  await deleteMessage(receiptHandle);
  return postResponse;
};
