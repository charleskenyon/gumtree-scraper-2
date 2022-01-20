const getNDaysFromNowSecondsEpoch = (days: number) => {
  const daysDurationSeconds = 60 * 60 * 24 * days;
  return Math.floor(new Date().valueOf() / 1000) + daysDurationSeconds;
};

export { getNDaysFromNowSecondsEpoch };
