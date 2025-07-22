import { FC } from 'react';

import CreateProfile from '../../components/create-profile/CreateProfile';
import PageTitle from '../../components/page-title meta/PageTitleMeta';
import { TITLE_CREATE_PROFILE_PAGE } from '../../constant/url-page.constants';

import style from './CreateProfilePage.module.scss';

const CreateProfilePage: FC = () => {
  return (
    <div className={style.createProfilePage}>
      <PageTitle title={TITLE_CREATE_PROFILE_PAGE} />
      <CreateProfile />
    </div>
  );
};

export default CreateProfilePage;
