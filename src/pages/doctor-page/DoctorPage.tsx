import classNames from 'classnames';

import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { getDoctorsByUid } from '../../api/doctor/doctors';
import { OUR_DOCTORS_PAGE } from '../../constant/url-page.constants';

import Avatar from '../../components/avatar/Avatar';
import { QKEY_GET_DOCTOR_BY_UID } from '../../constant/querykeyConstants';
import useChatListStore from '../../store/chatListStore';

import yearsFormat from '../../utils/yearsFormat';

import SeoUpdater from './SeoUpdater';

import style from './doctorPage.module.scss';

const DoctorPage = () => {
  // ______________
  const addUserInList = useChatListStore((state) => state.addUserInList);
  const userList = useChatListStore((state) => state.userList);

  const { doctorUid } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: [QKEY_GET_DOCTOR_BY_UID, { doctorUid }],
    queryFn: () => {
      if (doctorUid) {
        return getDoctorsByUid(doctorUid);
      }
      return undefined;
    },
    select: (res) => {
      return res?.data;
    },
    enabled: Boolean(doctorUid),
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && data && doctorUid) {
      addUserInList({
        uid: doctorUid,
        userData: { ...userList[doctorUid], ...data },
      });
    }
  }, [data, isLoading, doctorUid]);

  if (isLoading) return <div className="loader">Загрузка...</div>;
  if (!data) return <div>Пользователь не найден</div>;

  return (
    <>
      <SeoUpdater {...data} />
      <Helmet>
        <title>{data.last_name} - Профиль</title>
        <meta
          name="description"
          content={data.about_me || 'Пользователь нашего сервиса'}
        />
        <meta property="og:title" content={data.last_name} />
        <meta
          property="og:image"
          content={data.avatar_webp || '/default-avatar.png'}
        />

        {/* Schema.org разметка */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: data.last_name,
            url: window.location.href,
            image: data.avatar_webp,
            description: data.about_me,
          })}
        </script>
      </Helmet>

      <div className={style.profile}>
        <div className={style.headerWrapper}>
          <Avatar img={data.avatar_webp} size="large" />
          <h3>{data.last_name}</h3>
          <p
            className={style.name}
          >{`${data.first_name} ${data.patronymic}`}</p>
          <p className={classNames(style.icon, style.icon_specialization)}>
            {data.specialization.map((spec) => spec.name).join(', ')}
          </p>
          <p
            className={classNames(
              style.icon,
              style.icon_scientific_degree_label
            )}
          >
            {data.scientific_degree_label}
          </p>
        </div>
        <dl className={style.infoWrapper}>
          <dt>Стаж</dt>
          <dd>{yearsFormat(data.work_experience_years)}</dd>
          <dt>Место работы</dt>
          <dd>{data.work_place}</dd>
          <dt>Образование</dt>
          <dd>{data.academy_label}</dd>
          <dt>О себе</dt>
          <dd className={style.about}>{data.about_me}</dd>
        </dl>

        <Link className={style.back} to={`/${OUR_DOCTORS_PAGE}`}>
          - Назад -
        </Link>
      </div>
    </>
  );
};

export default DoctorPage;
