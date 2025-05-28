// общий тип профиля
export interface IUserProfile {
  uid: string;
  username: string;
  nickname: string;

  first_name: string;
  last_name: string;
  patronymic: string;
  additional_information: string;

  birthday: number | null;
  email: string;
  gender: 'male' | 'female' | null;
  gender_label: string | null;
  country: string;
  country_label: string;
  city_id: number | null;
  city: string | null;

  phone: string;

  avatar: string | null;
  avatar_url: string | null;
  avatar_webp: string | null;
  avatar_webp_url: string | null;

  is_doctor: boolean;
  is_confirmed_doctor: boolean;
  is_filled: boolean;
  is_staff: boolean;
}

// тип изменения данных профиля пациента

export interface UserInfoSend {
  nickname: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  additional_information: string;
  birthday: number;
  email: string;
  gender: 'male' | 'female';
  country: string;
  city_id: number;
  phone: string;
}
// тип response для изменения аватара юзера
export interface UserAvatar {
  file: string;
  file_url: string;
}
