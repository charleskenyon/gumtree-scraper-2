import axios from 'axios';
import { SQSEvent } from 'aws-lambda';
import {
  formatRequestUrl,
  extractData,
  getNDaysFromNowSecondsEpoch,
} from './lib';
import { AWS, LISTINGS_TABLE_NAME } from '/opt/nodejs/constants';
import { QueryItem } from '/opt/nodejs/types';

const dynamoDb = new AWS.DynamoDB();
const sqs = new AWS.SQS();

export const handler = async (event: SQSEvent): Promise<string> => {
  const {
    Records: [{ body, receiptHandle }],
  } = event;
  const queryItem: QueryItem = JSON.parse(body);
  const gumtreeRequestUrl = formatRequestUrl(queryItem);
  const response = await axios.get(gumtreeRequestUrl);
  const listings = extractData(response.data);
  await Promise.all(
    listings.map((listing) => {
      dynamoDb
        .putItem({
          TableName: LISTINGS_TABLE_NAME,
          Item: AWS.DynamoDB.Converter.marshall({
            ...listing,
            emails: queryItem.emails,
            ttl: getNDaysFromNowSecondsEpoch(30), // remove in 3 months
          }),
        })
        .promise();
    })
  );
  return gumtreeRequestUrl;
};

// const deleteMessage = ( { receiptHandle, queuUrl } )=> {
//   if ( !receiptHandle ) {
//     return H ( [] );
//   }
//   return H.wrapCallback ( SQS.deleteMessage.bind ( SQS ) ) ( {
//     QueueUrl: queuUrl,
//     ReceiptHandle: receiptHandle
//   } );
// };

// INSERT | MODIFY | REMOVE
// if(record.eventName == 'REMOVE') {
