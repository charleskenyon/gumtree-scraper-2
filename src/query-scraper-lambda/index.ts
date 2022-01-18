import { SQSEvent } from 'aws-lambda';

export const handler = async (event: SQSEvent): Promise<string> => {
  console.log(event);
  return 'working';
};
