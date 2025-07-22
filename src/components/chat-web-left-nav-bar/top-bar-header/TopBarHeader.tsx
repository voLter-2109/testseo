import classNames from 'classnames';
import { memo } from 'react';

import { ReactComponent as BackSvg } from '../../../assets/chat-top-bar/back_black.svg';

import style from './topBarHeader.module.scss';

type TopBarHeaderProps = {
  title: string;
  onBack: () => void;
  table: boolean;
  mobileL: boolean;
};

const TopBarHeader = ({ title, onBack, table, mobileL }: TopBarHeaderProps) => (
  <div
    className={classNames(style.topBarHeader, {
      [style.topBarHeaderTable]: table && !mobileL,
    })}
  >
    <div className={style.backBtn}>
      <BackSvg onClick={onBack} />
    </div>
    <h3 className={style.topBarTitle}>{title}</h3>
  </div>
);

export default memo(TopBarHeader);
