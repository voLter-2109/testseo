import { BaseListProps } from '../api/serverResponse';

// тип описывающий диплом в профиле врача
export interface Diploma {
  id: number;
  file: string;
  file_url: string;
  graduation_date: number | null;
  is_moderated: boolean;
  created_at: number;
}

// тип описывающий специализацию врача
export interface DoctorSpecialization {
  specialization_id: number;
  name: string;
  title: string;
  file: string;
  file_url: string;
  expiration_date: number;
  is_moderated: boolean;
  created_at: number;
}

// тип описывающий профиль врача
export interface DoctorInfo {
  about_me: string;
  academy: number;
  academy_label: string;
  age: string;
  avatar: string | null;
  avatar_webp: string | null;
  career_start_date: number | null;
  category: number;
  category_label: string;
  city: string | null;
  country: string;
  country_label: string;
  created_at: number;
  diploma: Diploma[];
  first_name: string;
  gender: string;
  gender_label: string;
  id: string;
  is_moderated: boolean;
  last_name: string;
  patronymic: string;
  rank: number;
  rank_label: string;
  rating: { value: string; last_updated_ar: Date };
  scientific_degree: number;
  scientific_degree_label: string;
  seniority: number;
  slug: string;
  specialization: DoctorSpecialization[];
  updated_at: number;
  work_experience_years: number;
  work_place: string;
}

// тип описывающий GET /doctors/list/
export interface DoctorsList extends BaseListProps {
  results: DoctorInfo[];
}

// ______________________________________________________________

// тип для изменения POST /doctors/profile Редактирование
export interface DoctorInfoSend {
  about_me: string;
  rank?: string;
  scientific_degree?: string;
  category?: string;
  academy: number;
  career_start_date: number;
  seniority: number;
  work_place: string;
}
