import url from 'url';
import nock from 'nock';
import sinon from 'sinon';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { handler } from '../src/query-scraper-lambda';
import * as lib from '../src/query-scraper-lambda/lib';
import { AWS, GUMTREE_URL, LISTINGS_TABLE_NAME } from '/opt/nodejs/constants';
import {
  MOCK_EVENT,
  MOCK_GUMTREE_HTML,
  MOCK_GUMTREE_PARSED_DATA,
} from './test-data';

jest.mock(
  '../src/query-scraper-lambda/lib/delete-message',
  () => () => Promise.resolve({})
);

const sandbox = sinon.createSandbox();
const formatRequestUrlSpy = jest.spyOn(lib, 'formatRequestUrl');
const postListingsItemsSpy = jest.spyOn(lib, 'postListingsItems');
const extractDataSpy = jest.spyOn(lib, 'extractData');
const deleteMessageSpy = jest.spyOn(lib, 'deleteMessage');
const dynamoDbPutSpy = jest.fn(() => ({
  promise: () => Promise.resolve({}),
}));

const { query, category, location, emails } = JSON.parse(
  MOCK_EVENT.Records[0].body
);

const requestUrl = lib.formatRequestUrl({ query, category, location });

nock(GUMTREE_URL)
  .persist()
  .get(url.parse(requestUrl).path)
  .reply(200, MOCK_GUMTREE_HTML);

describe('query scraper lambda integration test', () => {
  beforeAll(async () => {
    sandbox.stub(AWS.dynamoDbClient, 'send').value(dynamoDbPutSpy);
    await handler(MOCK_EVENT);
  });

  afterAll((done) => {
    sandbox.restore();
    done();
  });

  it('should call formatRequestUrl function with query, category and location info from first SQSEvent record', () => {
    expect(formatRequestUrlSpy).toHaveBeenCalledWith({
      query,
      category,
      location,
    });
  });

  it('should call extractData with the html string returned from the gumtree request', () => {
    expect(extractDataSpy).toHaveBeenCalledWith(MOCK_GUMTREE_HTML);
  });

  it('should call postListingsItems with parsed gumtree data extracted from html', () => {
    expect(postListingsItemsSpy).toHaveBeenCalledWith({
      listingsData: MOCK_GUMTREE_PARSED_DATA,
      emails,
    });
  });

  it('should call AWS.DynamoDB.DocumentClient put method from postListingsItems once', () => {
    expect(dynamoDbPutSpy).toBeCalledTimes(2);
    expect(JSON.stringify(dynamoDbPutSpy.mock.calls[0])).toEqual(
      JSON.stringify([
        new PutItemCommand({
          TableName: LISTINGS_TABLE_NAME,
          Item: {
            title: { S: MOCK_GUMTREE_PARSED_DATA[0].title },
            price: { S: MOCK_GUMTREE_PARSED_DATA[0].price },
            location: { S: MOCK_GUMTREE_PARSED_DATA[0].location },
            link: { S: MOCK_GUMTREE_PARSED_DATA[0].link },
            emails: { SS: emails },
            id: { S: MOCK_GUMTREE_PARSED_DATA[0].id },
          },
        }),
      ])
    );
  });

  it('should call deleteMessage with the receipt handle from the sqs event', () => {
    expect(deleteMessageSpy).toBeCalledWith(
      MOCK_EVENT.Records[0].receiptHandle
    );
  });
});
