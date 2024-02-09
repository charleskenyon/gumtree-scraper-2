import { SendEmailCommand } from '@aws-sdk/client-ses';
import generateSendEmailParams from './generate-send-email-params';
import { AWS } from '/opt/nodejs/constants';
import { ListingItem } from '/opt/nodejs/types';

const sendEmails = (uniqueEmails: string[], listings: ListingItem[]) =>
  Promise.all(
    uniqueEmails.map((email) => {
      const emailListings = listings.filter(({ emails }) =>
        emails?.includes(email)
      );
      return AWS.sesClient.send(
        new SendEmailCommand(generateSendEmailParams(email, emailListings))
      );
    })
  );

export default sendEmails;
