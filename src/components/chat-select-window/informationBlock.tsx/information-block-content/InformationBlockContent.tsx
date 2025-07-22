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
      <div className={style.headerWrapper}>
        <Avatar img={avatar_webp || avatar} />
        <h3>{`${last_name}`}</h3>
        <p className={style.name}>{`${first_name} ${patronymic}`}</p>
        <p className={classNames(style.icon, style.iconSpecialization)}>
          {specialization.map((spec) => spec.name).join(', ')}
        </p>
        <p className={classNames(style.icon, style.iconScientificDegreeLabel)}>
          {scientific_degree_label}
        </p>
      </div>
      <dl className={style.infoWrapper}>
        <dt>Стаж</dt>
        <dd>{yearsFormat(work_experience_years)}</dd>
        <dt>Место работы</dt>
        <dd>{work_place}</dd>
        <dt>Образование</dt>
        <dd>{academy_label}</dd>
        <dt>О себе</dt>
        <dd className={style.about}>{about_me}</dd>
      </dl>
    </div>
  );
};

export default InformationBlockContent;
