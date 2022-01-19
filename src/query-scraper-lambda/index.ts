import R from 'ramda';
import axios from 'axios';
import { SQSEvent } from 'aws-lambda';
import { GUMTREE_URL } from '/opt/nodejs/constants';
import { QueryItem } from '/opt/nodejs/types';

const formatRequestUrl = R.pipe(
  JSON.parse,
  ({ query, location, category }: QueryItem) =>
    `${GUMTREE_URL}/search?search_category=${
      encodeURIComponent(category) || 'all'
    }&q=${encodeURIComponent(query)}&search_location=${
      encodeURIComponent(location) || ''
    }`
);

export const handler = async (event: SQSEvent): Promise<string> => {
  const {
    Records: [{ body, receiptHandle }],
  } = event;
  const gumtreeRequestUrl = formatRequestUrl(body);
  const request = await axios.get(gumtreeRequestUrl);
  console.log(request);
  return gumtreeRequestUrl;
};
