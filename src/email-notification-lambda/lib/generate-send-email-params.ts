import R from 'ramda';
import { ListingItem } from '/opt/nodejs/types';

const generateSendEmailParams = (email: string, listings: ListingItem[]) => ({
  Destination: {
    ToAddresses: [email],
  },
  Message: {
    Body: {
      Text: {
        Data: listings
          .map(
            ({ title, price, link, location }) =>
              `${title} - ${price} - ${location} - ${link}`
          )
          .join('\n'),
      },
    },

    Subject: { Data: listings.map(R.prop('title')).join(',') },
  },
  Source: email,
});

export default generateSendEmailParams;
