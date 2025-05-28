const getMessageDate = (timestamp: number) => {
  const currentDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  const messageDate = {
    year: new Date(timestamp).getFullYear(),
    month: new Date(timestamp).getMonth() + 1,
    day: new Date(timestamp).getDate(),
  };

  if (
    currentDate.year === messageDate.year &&
    currentDate.month === messageDate.month
  ) {
    if (currentDate.day === messageDate.day) {
      return 'Сегодня';
    }

    if (currentDate.day === messageDate.day) {
      return 'Вчера';
    }
  }

  return `${String(messageDate.day).padStart(2, '0')}.${String(
    messageDate.month
  ).padStart(2, '0')}.${String(messageDate.year).slice(2)}`;
};

export default getMessageDate;
