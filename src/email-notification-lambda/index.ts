import { DynamoDBStreamEvent } from 'aws-lambda';

export const handler = async (
  event: DynamoDBStreamEvent
): Promise<DynamoDBStreamEvent> => {
  console.log('LOG', event);
  return event;
};
