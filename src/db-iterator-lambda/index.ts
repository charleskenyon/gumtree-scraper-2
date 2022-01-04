export const handler = async (): Promise<string> => {
  const result = await Promise.resolve('working');
  return result;
};

// lambdaHandler().then((v) => console.log(v));
