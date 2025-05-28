import classNames from 'classnames';
import { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';

import CustomButton from '../custom-button/Button';

import style from './RootBoundary.module.scss';

/**
 * @returns возвращает компонент  "Страница не найдена"
 */
const RootBoundaryPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className={classNames(style.wrapper)}>
      <div className={style.container}>
        <h1 className={style.big}>Oppss....</h1>
        <h1>An error as occured.</h1>
        <h1>
          <span className={style.ascii}>(╯°□°）╯︵ ┻━┻</span>
        </h1>

        <CustomButton
          className={style.button}
          onClick={() => navigate(-1)}
          textBtn="Go back"
        />
      </div>
    </div>
  );
};

export default memo(RootBoundaryPage);
