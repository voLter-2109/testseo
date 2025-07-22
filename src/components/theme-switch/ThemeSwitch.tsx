import { memo, useContext, useState } from 'react';
import Switch from 'react-switch';

import { ReactComponent as MunSvg } from '../../assets/theme-switch/moon.svg';
import { ReactComponent as SunSvg } from '../../assets/theme-switch/sun.svg';
import { ThemeContext } from '../../providers/ThemeProvider';

import style from './themeSwitch.module.scss';
import './themeSwitch.scss';

const ThemeSwitch = () => {
  const theme = useContext(ThemeContext);

  const [checked, setChecked] = useState<boolean>(theme?.theme !== 'dark');

  const handleSwitch = () => {
    theme?.handleChangeTheme();
    setChecked((prev) => !prev);
  };

  return (
    <Switch
      checkedIcon={<SunSvg className={style.icon} />}
      uncheckedIcon={<MunSvg className={style.icon} />}
      checked={checked}
      onChange={handleSwitch}
      className={style.switch}
    />
  );
};

export default memo(ThemeSwitch);
