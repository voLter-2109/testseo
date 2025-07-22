import classNames from 'classnames';
import { FC, memo, useMemo } from 'react';

import { ReactComponent as Cross } from '../../assets/create-profile/cross.svg';

import style from './crossBtn.module.scss';

interface Props {
  onClick: () => void;
  ariaLabel?: string;
  customClassName?: string;
}
const CrossBtn: FC<Props> = ({
  ariaLabel = 'Закрыть',
  onClick,
  customClassName,
}) => {
  const iconsConfig = [
    {
      Component: Cross,
      props: {
        onClick: (e: React.MouseEvent<SVGSVGElement>) => {
          e.preventDefault();
          onClick();
        },
        title: ariaLabel,
        className: classNames(style.btn_svg, customClassName),
      },
      deps: [onClick],
    },
  ];

  const memoizedIcons = iconsConfig.map(({ Component, props, deps }) =>
    useMemo(() => <Component {...props} />, deps)
  );

  const [memoizedAddIcon] = memoizedIcons;

  return <div className={style.btnClose}>{memoizedAddIcon}</div>;
};

export default memo(CrossBtn);
