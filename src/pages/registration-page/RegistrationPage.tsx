import { FC } from 'react';

import PageTitle from '../../components/page-title meta/PageTitleMeta';
import Registration from '../../components/registration/Registration';
import { TITLE_REGISTRATION_PAGE } from '../../constant/url-page.constants';

import style from './RegistrationPage.module.scss';

const RegistrationPage: FC = () => {
  console.log('перерисовка RegistrationPage 1 слой');

  return (
    <div className={style.wrapper}>
      <PageTitle title={TITLE_REGISTRATION_PAGE} />
      <div className={style.registrationPage}>
        <Registration />
        <div />
      </div>
    </div>
  );
};

export default RegistrationPage;
