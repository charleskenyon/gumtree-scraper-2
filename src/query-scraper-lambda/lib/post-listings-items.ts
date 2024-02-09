import { PutItemOutput, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { AWS, LISTINGS_TABLE_NAME } from '/opt/nodejs/constants';
import { ListingItem } from '/opt/nodejs/types';

const postListingsItems = ({
  listingsData,
  emails,
}: {
  listingsData: Omit<ListingItem, 'emails'>[];
  emails: ListingItem['emails'];
}): Promise<PutItemOutput[]> =>
  Promise.all(
    listingsData.map((listingData: Omit<ListingItem, 'emails'>) => {
      return AWS.dynamoDbClient.send(
        new PutItemCommand({
          TableName: LISTINGS_TABLE_NAME,
          Item: {
            title: { S: listingData.title },
            price: { S: listingData.price },
            location: { S: listingData.location },
            link: { S: listingData.link },
            emails: {
              L: emails.map((email) => ({
                S: email,
              })),
            },
            id: { S: listingData.id },
          },
        })
      );
    })
  );

export default postListingsItems;
