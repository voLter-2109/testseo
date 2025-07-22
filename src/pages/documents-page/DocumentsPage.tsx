import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import NavigationWrapper from '../../components/navigation-wrapper/NavigationWrapper';
import { DOCUMENTS_LINKS } from '../../constant/navLinkObjects';

import style from './documentsPage.module.scss';

const DocumentsPage: FC = () => {
  return (
    <main className={style.wrapper}>
      <h2>Юридическая информация</h2>
      <div className={style.navigation}>
        <NavigationWrapper
          wrapperStyle="wrapperColumn"
          links={DOCUMENTS_LINKS}
        />
      </div>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1>Внимание!</h1>
        <p style={{ fontSize: '1.1rem' }}>
          Сервис находится на этапе пилотного тестирования. Все предоставляемые
          рекомендации носят исключительно информационный характер. Решение о
          следовании данным рекомендациям принимается пользователем
          самостоятельно. В рамках работы сервиса врачи не ставят диагнозы, не
          выписывают рецепты и не оказывают телемедицинские услуги.
          <br /> Сервис не несет ответственности за результаты консультаций,
          полученных в процессе использования.
        </p>
      </div>
      <div className={style.content}>
        <Outlet />
      </div>
    </main>
  );
};

export default DocumentsPage;
