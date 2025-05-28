import { Academy } from '../../types/academy/academy';
import {
  OrderParams,
  SearchAndFilterParams,
  SearchParams,
} from '../../types/api/search-filter-type';
import {
  Diploma,
  DoctorInfo,
  DoctorInfoSend,
  DoctorsList,
  DoctorSpecialization,
} from '../../types/doctor/doctor';
import {
  DoctorSpecializationProps,
  SpecializationsListItem,
} from '../../types/specialization/specialization';
import { apiClassic, apiWithAuth } from '../api';

/**
 * @name getDoctorsList
 * @description запрос на получение списка врачей
 * @prop {object} params?: example type DoctorsListParams
 * @returns {object} example type DoctorsList
 */
// ПРОВЕРЕНО
export const getDoctorsList = (params?: SearchAndFilterParams) =>
  apiClassic.get<DoctorsList>('/doctors/list/', { params });

/**
 * @name getDoctorsByUid
 * @description запрос на получение отдельного врача
 * @prop {string} uid: string
 * @returns {object} example type ?
 */
// ПРОВЕРЕНО
export const getDoctorsByUid = (uid: string) =>
  apiClassic.get<DoctorInfo>(`/doctors/list/${uid}/`);

/**
 * @name getCurrentDoctor
 * @description запрос на получение профиля текущего доктора
 * @prop {object} data: при вызове метода не передаем ничего,
 * по умолчанию пустой объект вернет текущий профиль
 * @returns example type DoctorInfo
 */
// ПРОВЕРЕНО
export const getCurrentDoctor = (data = {}) =>
  apiWithAuth.post<DoctorInfo>('/doctors/profile/', data);

/**
 * @name updateCurrentDoctor
 * @description запрос на редактирование профиля текущего доктора
 * @prop {object} newDoctorInfo: example type DoctorInfoSend
 * @returns example type DoctorInfo
 */
// ПРОВЕРЕНО
export const updateCurrentDoctor = (newDoctorInfo: Partial<DoctorInfoSend>) =>
  apiWithAuth.post<DoctorInfo>('/doctors/profile/', newDoctorInfo);

/**
 * @name getCurrentDoctorSpecialization
 * @description получение специализаций текущего врача
 * @returns array of type DoctorSpecialization
 */
// ПРОВЕРЕНО
export const getCurrentDoctorSpecialization = () =>
  apiWithAuth.get<DoctorSpecialization[]>('/doctors/specialization_doctor/');

/**
 * @name addDiploma
 * @description добавление диплома для текущего врача
 * @prop {File} file: файл диплома
 * @prop {number} graduation_date?: дата выпуска
 * @returns example type Diploma
 */
// ПРОВЕРЕНО
export const addDiploma = (file: File, graduation_date?: number) => {
  return apiWithAuth.post<Diploma>(
    '/doctors/diploma/',
    { file, graduation_date },
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
};

/**
 * @name addAcademy
 * @description добавление академии для текушего врача
 * @prop {string} name: название академии
 * @returns example type Academy
 */
// ПРОВЕРЕНО
export const addAcademy = (name: string) => {
  return apiWithAuth.post<Academy>('/doctors/academy/', { name });
};

/**
 * @name addSpecialization
 * @description добавление специализации текущего врача
 * @prop {object} data: example type DoctorSpecializationProps
 * @returns example type DoctorSpecialization
 */
// ПРОВЕРЕНО
export const addSpecialization = (data: DoctorSpecializationProps) => {
  return apiWithAuth.post<DoctorSpecialization>(
    '/doctors/specialization_doctor/',
    data,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
};

/**
 * @name deleteSpecialization
 * @description удаление специализации текущего врача
 * @prop {string} id: id специализации
 * @returns {void}
 */
// ПРОВЕРЕНО
export const deleteSpecialization = (id: number) => {
  return apiWithAuth.delete(`/doctors/specialization_doctor/${id}/`);
};

/**
 * @name deleteAcademy
 * @description удаление академии текущего врача
 * @prop {number} id: id академии
 * @returns {void}
 */
// ПРОВЕРЕНО
export const deleteAcademy = (id: number) => {
  return apiWithAuth.delete(`/doctors/academy/${id}`);
};

/**
 * @name deleteDiploma
 * @description удаление диплома текущего врача
 * @prop {number} id: id диплома
 * @returns {void}
 */
// ПРОВЕРЕНО
export const deleteDiploma = (id: number) => {
  return apiWithAuth.delete(`/doctors/diploma/${id}/`);
};

/**
 * @name getAcademiesList
 * @description получение списка академий
 * @prop {object} params?: example type SearchAndFilterParams
 * @returns example type AcademiesList
 */
// ПРОВЕРЕНО
export const getAcademiesList = (params?: SearchParams) => {
  return apiWithAuth.get<Academy[]>('/doctors/academy/', { params });
};

/**
 * @name getSpecializationsList
 * @description получение списка специализаций
 * @prop {object} params?: example type SearchParams
 * @returns array of type SpecializationsListItem
 */
// ПРОВЕРЕНО
export const getSpecializationsList = (params?: SearchParams) => {
  return apiWithAuth.get<SpecializationsListItem[]>(
    '/doctors/specializations/',
    {
      params,
    }
  );
};

/**
 * @name getDoctorSpecializations
 * @description получение списка специализаций для текушего врача
 * @prop {object} params?: example type OrderParams
 * @returns array of type DoctorSpecialization
 */
// ПРОВЕРЕНО
export const getDoctorSpecializations = (params?: OrderParams) => {
  return apiWithAuth.get<DoctorSpecialization[]>(
    '/doctors/specialization_doctor/',
    {
      params,
    }
  );
};
