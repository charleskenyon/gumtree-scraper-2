import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-west-2',
  maxRetries: 3,
  apiVersions: {
    dynamodb: '2012-08-10',
    sqs: '2012-11-05',
  },
});

const QUEUE_URL = process.env.QUEUE_URL;

const QUERY_TABLE_NAME = 'queryTable';

const LISTINGS_TABLE_NAME = 'listingsTable';

const GUMTREE_URL = 'https://www.gumtree.com';

export { AWS, QUEUE_URL, QUERY_TABLE_NAME, LISTINGS_TABLE_NAME, GUMTREE_URL };
