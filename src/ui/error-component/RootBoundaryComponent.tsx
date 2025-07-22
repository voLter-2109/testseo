import classNames from 'classnames';
import { FC } from 'react';

import { ReactComponent as Refresh } from '../../assets/error-component/refresh.svg';

import style from './RootBoundary.module.scss';

type Props = {
  refreshFunc?: () => void;
  ariaTitle?: string;
  isLoading?: boolean;
};
/**
 * @returns возвращает компонент  "Страница не найдена"
 */
const RootBoundaryComponent: FC<Props> = ({
  refreshFunc,
  ariaTitle,
  isLoading = false,
}) => {
  return (
    <div className={classNames(style.wrapper, style.component)}>
      <div className={style.container}>
        <h1 className={style.big}>Oppss....</h1>
        <h1>An error as occured.</h1>
        <h1>
          <span className={style.ascii}>(╯°□°）╯︵ ┻━┻</span>
        </h1>
        {refreshFunc && (
          <Refresh
            aria-label="попробовать снова"
            className={style.refresh}
            onClick={() => {
              console.log(isLoading);
              if (!isLoading) {
                refreshFunc();
              }
            }}
            title={ariaTitle}
          />
        )}
      </div>
    </div>
  );
};

export default RootBoundaryComponent;
