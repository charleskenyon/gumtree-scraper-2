import { DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { AWS, QUEUE_URL } from '/opt/nodejs/constants';

const deleteMessage = (receiptHandle: string) =>
  AWS.sqsClient.send(
    new DeleteMessageCommand({
      QueueUrl: QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
  );

export default deleteMessage;
