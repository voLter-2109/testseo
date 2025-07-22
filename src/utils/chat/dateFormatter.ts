const dateFormatter = (timestamp: number): string => {
  const newMessageTime = timestamp * 1000;
  const currentDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  const messageDate = {
    year: new Date(newMessageTime).getFullYear(),
    month: new Date(newMessageTime).getMonth() + 1,
    day: new Date(newMessageTime).getDate(),
  };
  if (
    currentDate.day === messageDate.day &&
    currentDate.month === messageDate.month &&
    currentDate.year === messageDate.year
  ) {
    return `${String(new Date(newMessageTime).getHours()).padStart(
      2,
      '0'
    )}:${String(new Date(newMessageTime).getMinutes()).padStart(2, '0')}`;
  }

  return `${String(messageDate.day).padStart(2, '0')}.${String(
    messageDate.month
  ).padStart(2, '0')}.${String(messageDate.year).slice(2)}`;
};

export default dateFormatter;
