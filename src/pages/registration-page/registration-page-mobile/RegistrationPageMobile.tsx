import { FC } from 'react';
import { useOutlet } from 'react-router';

// import MobileBottomBar from '../../../components/mobile-bottom-bar/MobileBottomBar';
import RegistrationPage from '../RegistrationPage';

import style from './RegistrationPageMobile.module.scss';

const RegistrationPageMobile: FC = () => {
  const outlet = useOutlet();

  return (
    <>
      <div className={style.wrapper}>{outlet || <RegistrationPage />}</div>
    </>
  );
};

export default RegistrationPageMobile;
