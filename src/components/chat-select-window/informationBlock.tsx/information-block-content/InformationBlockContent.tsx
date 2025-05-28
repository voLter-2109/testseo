/* eslint-disable @typescript-eslint/naming-convention */

import classNames from 'classnames';
import { FC } from 'react';

import { DoctorInfo } from '../../../../types/doctor/doctor';
import yearsFormat from '../../../../utils/yearsFormat';
import Avatar from '../../../avatar/Avatar';

import style from './informationBlockContent.module.scss';

const InformationBlockContent: FC<DoctorInfo> = (props) => {
  const {
    avatar,
    avatar_webp,
    last_name,
    first_name,
    patronymic,
    specialization,
    scientific_degree_label,
    work_experience_years,
    work_place,
    academy_label,
    about_me,
  } = props;

  return (
    <div className={style.card}>
      <div className={style.header_wrapper}>
        <Avatar img={avatar_webp || avatar} />
        <h3>{`${last_name}`}</h3>
        <p className={style.name}>{`${first_name} ${patronymic}`}</p>
        <p className={classNames(style.icon, style.icon_specialization)}>
          {specialization.map((spec) => spec.name).join(', ')}
        </p>
        <p
          className={classNames(style.icon, style.icon_scientific_degree_label)}
        >
          {scientific_degree_label}
        </p>
      </div>
      <ul className={style.info_wrapper}>
        <h4>Стаж</h4>
        <li>{yearsFormat(work_experience_years)}</li>
        <h4>Место работы</h4>
        <li>{work_place}</li>
        <h4>Образование</h4>
        <li>{academy_label}</li>
        <h4>О себе</h4>
        <li>{about_me}</li>
      </ul>
    </div>
  );
};

export default InformationBlockContent;
