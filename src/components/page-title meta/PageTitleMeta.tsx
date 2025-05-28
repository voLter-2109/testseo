import { FC, memo, useEffect } from 'react';

type PageTitleProps = {
  title: string;
};

const PageTitle: FC<PageTitleProps> = ({ title }) => {
  console.log('перерисовка PageTitle');
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};

export default memo(PageTitle);
