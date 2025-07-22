import { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import classNames from 'classnames';

import CustomButton from '../../ui/custom-button/Button';

import style from './not-found.module.scss';

type Props = {
  global?: boolean;
};

/**
 * @returns возвращает компонент  "Страница не найдена"
 */
const NotFound: FC<Props> = ({ global = false }) => {
  const navigate = useNavigate();

  return (
    <div className={classNames(style.wrapper, { [style.global]: global })}>
      <div className={style.container}>
        {global && <h1 className={style.big}>404</h1>}
        <h1>An error as occured.</h1>
        <h1>
          <span className={style.ascii}>(╯°□°）╯︵ ┻━┻</span>
        </h1>
        {global && (
          <CustomButton
            className={style.button}
            onClick={() => navigate(-1)}
            textBtn="Go back"
          />
        )}
      </div>
    </div>
  );
};

export default NotFound;
