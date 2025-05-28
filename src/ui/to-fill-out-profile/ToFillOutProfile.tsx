import LinkMobileCheck from '../../components/link-mobile-check/LinkMobileCheck';
import { CREATE_PROFILE_PAGE } from '../../constant/url-page.constants';

import style from './toFillOutProfile.module.scss';

const ToFillOutProfile = () => {
  return (
    <div className={style.container}>
      <p>Чтобы воспользоваться чатом, Вам необходимо заполнить свой профиль</p>
      <LinkMobileCheck to={CREATE_PROFILE_PAGE} className={style.link}>
        Заполнить профиль
      </LinkMobileCheck>
    </div>
  );
};

export default ToFillOutProfile;
