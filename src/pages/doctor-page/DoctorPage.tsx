import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

import { getDoctorsByUid } from '../../api/doctor/doctors';
import Avatar from '../../components/avatar/Avatar';
import { QKEY_GET_DOCTOR_BY_UID } from '../../constant/querykeyConstants';
import SeoUpdater from './SeoUpdater';

const DoctorPage = () => {
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

  if (isLoading) return <div className="loader">Загрузка...</div>;
  if (!data) return <div>Пользователь не найден</div>;

  return (
    <>
      <SeoUpdater {...data} />
      <Helmet>
        <title>{data.first_name} - Профиль</title>
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
            name: data.first_name,
            url: window.location.href,
            image: data.avatar,
            description: data.about_me,
          })}
        </script>
      </Helmet>

      <div className="profile">
        <Avatar img={data.avatar_webp} />
        <h1>{data.first_name}</h1>
        <p>{data.about_me}</p>
      </div>
    </>
  );
};

export default DoctorPage;
