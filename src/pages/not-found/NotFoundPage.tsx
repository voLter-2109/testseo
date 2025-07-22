import { FC } from 'react';

import NotFound from '../../components/not-found/NotFound';
import PageTitle from '../../components/page-title meta/PageTitleMeta';

type Props = {
  global?: boolean;
};

const NotFoundPage: FC<Props> = ({ global }) => {
  return (
    <>
      <PageTitle title="404 | Page not found" />
      <NotFound global={global} />
    </>
  );
};

export default NotFoundPage;
