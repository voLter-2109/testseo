import LinkMobileCheck from '../../components/link-mobile-check/LinkMobileCheck';
import { REGISTRATION_PAGE } from '../../constant/url-page.constants';

import style from './toFillOutProfile.module.scss';

const ToFillOutRegistration = () => {
  return (
    <div className={style.container}>
      <p>Чтобы воспользоваться чатом, необходимо войти в аккаунт</p>
      <LinkMobileCheck to={REGISTRATION_PAGE} className={style.link}>
        Вход
      </LinkMobileCheck>
    </div>
  );
};

export default ToFillOutRegistration;
