import axios from 'axios';
import { SQSEvent } from 'aws-lambda';
import { formatRequestUrl, extractData } from './lib';

export const handler = async (event: SQSEvent): Promise<string> => {
  const {
    Records: [{ body, receiptHandle }],
  } = event;
  const gumtreeRequestUrl = formatRequestUrl(body);
  const response = await axios.get(gumtreeRequestUrl);
  const listings = extractData(response.data);
  return gumtreeRequestUrl;
};
