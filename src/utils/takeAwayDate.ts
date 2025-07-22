/**
 *
 * @param years
 * @example
 * текущая дата 11.09.2024
 * takeAwayDate(4, '-')
 * return 2000-09-11
 */

const takeAwayDate = (years: number, math: '+' | '-'): string => {
  const currentDate = new Date();
  const eighteenYearsAgo = new Date(currentDate);
  if (math === '+')
    eighteenYearsAgo.setFullYear(currentDate.getFullYear() + years);
  else eighteenYearsAgo.setFullYear(currentDate.getFullYear() - years);

  const dateString = eighteenYearsAgo.toLocaleDateString().replaceAll('.', '-');
  const dateArr = dateString.split('-');
  const string = dateArr.reverse().join('-');

  return string;
};

export default takeAwayDate;
