import { FC, HTMLAttributes } from 'react';

import style from './divider.module.scss';

interface Props extends HTMLAttributes<HTMLSpanElement> {}

const Divider: FC<Props> = () => <span className={style.divider}> </span>;

export default Divider;
