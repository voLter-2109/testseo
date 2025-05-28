import { useContext } from 'react';

import { ReactComponent as LogoBlack } from '../../assets/logo/logo_big.svg';
import { ReactComponent as LogoWhite } from '../../assets/logo/logo_big_white.svg';
import { ThemeContext } from '../../providers/ThemeProvider';

import style from './preload.module.scss';

const Preload = () => {
  const theme = useContext(ThemeContext);
  return (
    <div className={style.preload}>
      <div className={style.loading}>
        {theme?.theme === 'dark' ? <LogoWhite /> : <LogoBlack />}
        {/* <div className={style.loadingText}>
          <span>Загрузка</span>
          <div className={style.dots} />
          <div className={style.dots} />
          <div className={style.dots} />
        </div> */}
      </div>
    </div>
  );
};

export default Preload;
