import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-west-2',
  maxRetries: 3,
  apiVersions: {
    dynamodb: '2012-08-10',
    sqs: '2012-11-05',
  },
});

const QUERY_TABLE_NAME = 'queryTable';

const GUMTREE_URL = 'https://www.gumtree.com';

export { AWS, QUERY_TABLE_NAME, GUMTREE_URL };
