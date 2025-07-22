const yearsFormat = (years: number): string => {
  if (years % 100 >= 11 && years % 100 <= 19) {
    return `${years} лет`;
  }

  switch (years % 10) {
    case 1:
      return `${years} год`;
    case 2:
    case 3:
    case 4:
      return `${years} года`;
    default:
      return `${years} лет`;
  }
};

export default yearsFormat;
