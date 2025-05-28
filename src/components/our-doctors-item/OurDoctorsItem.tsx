/* eslint-disable @typescript-eslint/naming-convention */

import classNames from 'classnames';
import { forwardRef, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

import useWindowResize from '../../hooks/useWindowResize';
import useUserStore from '../../store/userStore';
import { DoctorInfo } from '../../types/doctor/doctor';
import CustomButton from '../../ui/custom-button/Button';
import yearsFormat from '../../utils/yearsFormat';
import Avatar from '../avatar/Avatar';

import style from './ourDoctorsItem.module.scss';

interface Props extends DoctorInfo {
  searchValue: string;
}

const OurDoctorsItem = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { mobileL } = useWindowResize();
  const { user } = useUserStore((state) => state);
  const {
    id,
    avatar,
    avatar_webp,
    specialization,
    patronymic,
    last_name,
    first_name,
    work_experience_years,
    academy_label,
    work_place,
    about_me,
    searchValue,
  } = props;
  const [showInfo, setShowInfo] = useState(false);
  const handleCardClick = () => {
    setShowInfo(!showInfo);
  };

  const searchSpecialization = useMemo(() => {
    if (searchValue) {
      const escapedSearch = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedSearch})`, 'gi');

      // создаем массив специализаций
      const sp = specialization.map((i) => {
        return i.name;
      });

      // находим ту что подходит на найденным словам
      const foundSpec = sp.find((spec) => spec.match(regex)) || null;

      if (foundSpec) {
        const parts = foundSpec.split(regex);

        return parts.map((part, index) => {
          const k = `${index}${part}`;
          return regex.test(part) ? (
            <span key={k} style={{ fontWeight: 'bold' }} className={style.text}>
              {part}
            </span>
          ) : (
            <span key={part} className={style.text}>
              {part}
            </span>
          );
        });
      }
    }

    if (specialization.length > 1) {
      return (
        <>
          <span className={style.text}>{specialization[0].name}</span>
          <span style={{ cursor: 'pointer' }}>...</span>
        </>
      );
    }
    return <p className={style.text}>{specialization[0].name}</p>;
  }, [searchValue]);

  return (
    <div
      ref={ref}
      className={classNames(style.card, { [style.card_tansform]: showInfo })}
    >
      <div
        className={showInfo ? style.card_info : ''}
        onClick={handleCardClick}
      >
        {showInfo ? (
          <>
            <p className={style.title}>
              Стаж:
              <span className={style.text}>
                {` ${yearsFormat(work_experience_years)}`}
              </span>
            </p>
            <p className={style.title}>Специализация:</p>
            <div>
              {specialization.map((i) => {
                return (
                  <p className={style.text} key={`about${i.name}`}>
                    {i.name}
                  </p>
                );
              })}
            </div>
            <p className={style.title}>Специализация:</p>
            {specialization.map((item) => {
              return <p className={style.text}>{item.name}</p>;
            })}
            <p className={style.title}>Образование: </p>
            <p className={style.text}>{academy_label}</p>
            <p className={style.title}>Место работы:</p>
            <p className={style.text}>{work_place}</p>
            <p className={style.title}>О себе:</p>
            <p className={style.text}>{about_me}</p>
          </>
        ) : (
          <>
            <Avatar img={avatar_webp || avatar} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p
                className={style.title}
              >{`${last_name} ${first_name} ${patronymic}`}</p>
              <div>{searchSpecialization}</div>
            </div>
          </>
        )}
      </div>
      {user &&
        user.is_filled &&
        (!user.is_doctor || (user.is_doctor && user.is_confirmed_doctor)) && (
          <NavLink to={mobileL ? `/m/${id}` : `/${id}`}>
            <CustomButton textBtn="Написать" styleBtn="primary" />
          </NavLink>
        )}
    </div>
  );
});

export default OurDoctorsItem;
