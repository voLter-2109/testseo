/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DoctorInfo } from '../../types/doctor/doctor';

export default function SeoUpdater(props: DoctorInfo) {
  const { pathname } = useLocation();
  const { first_name, last_name } = props;

  useEffect(() => {
    // Обновляем мета-теги
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', `Врач ${first_name} - ${last_name}`);

    // Добавляем breadcrumbs
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Главная',
          item: 'https://online-hospital-react-socket-1.vercel.app/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Врачи',
          item: 'https://online-hospital-react-socket-1.vercel.app/our-doctor/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: first_name,
          item: `https://online-hospital-react-socket-1.vercel.app/our-doctor/${pathname}`,
        },
      ],
    });

    document.head.appendChild(breadcrumbScript);

    return () => {
      document.head.removeChild(breadcrumbScript);
    };
  }, [props, pathname]);

  return null;
}
