import generateSendEmailParams from './generate-send-email-params';
import { AWS } from '/opt/nodejs/constants';
import { ListingItem } from '/opt/nodejs/types';

const ses = new AWS.SES();

const sendEmails = (uniqueEmails: string[], listings: ListingItem[]) =>
  Promise.all(
    uniqueEmails.map((email) => {
      const emailListings = listings.filter(({ emails }) =>
        emails.includes(email)
      );
      return ses
        .sendEmail(generateSendEmailParams(email, emailListings))
        .promise();
    })
  );

export default sendEmails;
