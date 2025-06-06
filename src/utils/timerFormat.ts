const timerFormat = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds < 10) {
    return `${minutes}:0${remainingSeconds}`;
  }

  return `${minutes}:${remainingSeconds}`;
};
export default timerFormat;
