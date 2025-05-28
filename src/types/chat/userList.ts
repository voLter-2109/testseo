// тип для store chatList - UserList
export interface UserList {
  uid: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  avatar: string | null;
  avatar_url: string | null;
  avatar_webp: string | null;
  avatar_webp_url: string | null;
  is_doctor_check: boolean;
  is_online: boolean;
  was_online_at?: number;
}
