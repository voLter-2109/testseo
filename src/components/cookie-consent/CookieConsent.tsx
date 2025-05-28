import classNames from 'classnames';
import Cookies from 'js-cookie';
import { memo, useCallback, useEffect, useState } from 'react';

import { COOKIE_CONSENT, WITHOUT_USER } from '../../constant/other-constants';
import useUserStore from '../../store/userStore';
import CustomButton from '../../ui/custom-button/Button';

import style from './cookieConsent.module.scss';

type ConsentData = Record<string, boolean>;

export const removeNullConsent = () => {
  const cookieConsent = Cookies.get(COOKIE_CONSENT);
  const consentData: ConsentData = cookieConsent
    ? JSON.parse(cookieConsent)
    : {};
  if (Object.prototype.hasOwnProperty.call(consentData, WITHOUT_USER)) {
    delete consentData[WITHOUT_USER];
    Cookies.set(COOKIE_CONSENT, JSON.stringify(consentData), {
      expires: 365,
    });
  }
};

const CookieConsent = () => {
  console.log('перерисовка CookieConsent');
  const user = useUserStore((state) => state.user);
  const [isVisible, setIsVisible] = useState(false);

  const handleConsent = useCallback(
    (solution: boolean) => {
      const cookieConsent = Cookies.get(COOKIE_CONSENT) || '{}';
      const consentData: ConsentData = JSON.parse(cookieConsent);
      consentData[user?.uid || WITHOUT_USER] = solution;

      Cookies.set(COOKIE_CONSENT, JSON.stringify(consentData), {
        expires: 365,
      });
      setIsVisible(false);
    },
    [user?.uid]
  );

  useEffect(() => {
    const cookieConsent = Cookies.get(COOKIE_CONSENT) || '{}';
    const consentData = JSON.parse(cookieConsent);

    if (
      user === null &&
      !Object.prototype.hasOwnProperty.call(consentData, WITHOUT_USER)
    ) {
      setIsVisible(true);
    }

    if (
      user === null &&
      Object.prototype.hasOwnProperty.call(consentData, WITHOUT_USER)
    ) {
      setIsVisible(false);
    }

    if (
      user !== null &&
      !Object.prototype.hasOwnProperty.call(consentData, user.uid) &&
      Object.prototype.hasOwnProperty.call(consentData, WITHOUT_USER)
    ) {
      handleConsent(consentData[WITHOUT_USER]);
      setIsVisible(false);
      removeNullConsent();
    }

    if (
      user !== null &&
      !Object.prototype.hasOwnProperty.call(consentData, user.uid) &&
      !Object.prototype.hasOwnProperty.call(consentData, WITHOUT_USER)
    ) {
      setIsVisible(true);
    }

    if (
      user !== null &&
      Object.prototype.hasOwnProperty.call(consentData, user.uid)
    ) {
      setIsVisible(false);
    }
  }, [user]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={classNames(style.popup, isVisible && style.popup_show)}>
      <div className={style.container}>
        <CustomButton
          title="Закрыть"
          textBtn=""
          className={style.close}
          onClick={() => handleConsent(false)}
        />
        <p>
          Мы используем файлы cookie, чтобы улучшить работу сайта. Продолжая
          пользоваться сайтом, Вы соглашаетесь с использованием файлов cookie.
        </p>
        <div className={style.buttonsContainer}>
          <CustomButton
            title="Принять"
            textBtn="Принять"
            onClick={() => handleConsent(true)}
          />
          <CustomButton
            title="Отклонить"
            textBtn="Отклонить"
            onClick={() => handleConsent(false)}
            styleBtn="secondary"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(CookieConsent);
