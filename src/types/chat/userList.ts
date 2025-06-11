// тип для store chatList - UserList
export interface UserList {
  uid: string;
  username: string;
  nickname: string;
  first_name: string;
  last_name: string;
  patronymic: string;

  avatar: string | null;
  avatar_url: string | null;
  avatar_webp: string | null;
  avatar_webp_url: string | null;

  is_filled: boolean;
  additional_information: string;
  birthday: number | null;

  is_doctor: boolean;
  is_online: boolean;
  is_blocked: boolean;
  was_online_at: number;
}
