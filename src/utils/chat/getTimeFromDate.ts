const getTimeFromDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default getTimeFromDate;
