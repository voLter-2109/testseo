import { FC } from 'react';

import style from './DateBadge.module.scss';

interface DateBadgeProps {
  date: string;
}

const DateBadge: FC<DateBadgeProps> = ({ date }) => {
  return <div className={style.badge}>{date}</div>;
};

export default DateBadge;
