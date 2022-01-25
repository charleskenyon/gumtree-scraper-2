import { AWS, QUEUE_URL } from '/opt/nodejs/constants';

const deleteMessage = (receiptHandle: string) =>
  new AWS.SQS()
    .deleteMessage({ QueueUrl: QUEUE_URL, ReceiptHandle: receiptHandle })
    .promise();

export default deleteMessage;
