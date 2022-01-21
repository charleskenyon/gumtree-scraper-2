import { AWS, LISTINGS_TABLE_NAME } from '/opt/nodejs/constants';
import { ListingItem } from '/opt/nodejs/types';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const postListingsItems = ({
  listingsData,
  emails,
}: {
  listingsData: Omit<ListingItem, 'emails'>[];
  emails: ListingItem['emails'];
}): Promise<AWS.DynamoDB.PutItemOutput[]> =>
  Promise.all(
    listingsData.map((listingData: Omit<ListingItem, 'emails'>) => {
      return dynamoDb
        .put({
          TableName: LISTINGS_TABLE_NAME,
          Item: { ...listingData, emails },
        })
        .promise();
    })
  );

export default postListingsItems;
