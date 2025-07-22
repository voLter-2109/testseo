import { Diploma } from '../../types/doctor/doctor';

// это дефолт по специализации
export interface INewSpec {
  oldEntry: boolean;
  is_delete: boolean;
  new_file: File[] | null;

  specialization_id: number | null;
  name: string;
  title: string;
  file: string;
  file_url: string;
  expiration_date: string;
  is_moderated: boolean;
  created_at: number;
}

// ! похоже не нужно
export interface IUserForForm {
  is_doctor: boolean;
  phone: string;
  city_id: number | null;
  country: string | null;
  gender: 'male' | 'female' | null;
  email: string;
  birthday: string | null;
  patronymic: string;
  last_name: string;
  first_name: string;
  nickname: string;
  additional_information: '';
}

// ! похоже не нужно
export interface IDoctorForForm {
  academy: number | null;
  work_place: '';
  rank: string;
  scientific_degree: string;
  category: string;
  seniority: number;
  career_start_date: string | null;
  about_me: string | null;
}

// это новые данные из формы по специализации
export interface ISpecForForm {
  specialization: INewSpec[] | null;
  delete_specialization: number[];
}

// это дефолт по специализациям
export interface ISpecDefForForm {
  // ! подумать как сделать
  specialization: INewSpec[] | [];
  delete_specialization: number[];
}

export interface IDipForForm {
  diploma: Diploma[] | null;
  diplomaNew: File[] | null;
}

// это дефолт всего профиля
export interface IDefaultFormProps {
  user: IUserForForm;
  doctor: IDoctorForForm;
  specialization: ISpecDefForForm;
  diploma: IDipForForm;
}

// ! это то что приходит когда нажимаем отправить
export interface IFormProps {
  user: IUserForForm;
  doctor: IDoctorForForm;
  specialization: ISpecForForm;
  diploma: IDipForForm;
}
