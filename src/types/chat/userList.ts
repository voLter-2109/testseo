import { DoctorSpecialization } from '../doctor/doctor';
import { TChannels } from '../websoket/websoket.types';

// тип для store chatList - UserList
export interface UserList {
  uid: string;
  username: string;
  nickname: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  chat_type: TChannels;

  avatar: string | null;
  avatar_url: string | null;
  avatar_webp: string | null;
  avatar_webp_url: string | null;

  is_filled: boolean;
  additional_information: string;
  birthday: number | null;

  is_online: boolean;
  is_blocked: boolean;
  was_online_at: number;

  // инфо для доктора
  is_doctor: boolean;
  specialization: DoctorSpecialization[] | null;
  work_experience_years: number;
  scientific_degree_label: string;
  work_place: string;
  academy_label: string;
  about_me: string;

  // инфо для чата
  participants: {
    uid: string;
    full_name: string;
  }[];
  owner_full_name: string;
  description: string;
  name: string;
}
