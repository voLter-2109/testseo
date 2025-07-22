/* eslint-disable @typescript-eslint/naming-convention */

import { forwardRef, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';

import useWindowResize from '../../hooks/useWindowResize';
import useUserStore from '../../store/userStore';
import { DoctorInfo } from '../../types/doctor/doctor';
import CustomButton from '../../ui/custom-button/Button';
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
    searchValue,
  } = props;

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

  const isUser: boolean | null =
    user &&
    user.is_filled &&
    (!user.is_doctor || (user.is_doctor && user.is_confirmed_doctor));

  return (
    <div ref={ref} className={style.card}>
      <div className={style.card_info}>
        <Avatar img={avatar_webp || avatar} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p
            className={style.title}
          >{`${last_name} ${first_name} ${patronymic}`}</p>
          <div>{searchSpecialization}</div>
        </div>
      </div>
      <div className={style.btnWrapper}>
        <NavLink to={isUser ? (mobileL ? `/m/${id}` : `/${id}`) : `/`}>
          <CustomButton
            classNameBtn={style.btn}
            textBtn="Написать"
            styleBtn="primary"
          />
        </NavLink>

        <Link to={id}>
          <CustomButton
            classNameBtn={style.btn}
            textBtn="О враче"
            styleBtn="primary"
          />
        </Link>
      </div>
    </div>
  );
});

export default OurDoctorsItem;
