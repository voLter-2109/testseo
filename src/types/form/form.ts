export interface EditProfileFormDataSpecialization {
  title: {
    value: number;
    label: string;
  };
  certificate: File;
  expiration_date: number;
  specialization_id: number;
}

export interface EditProfileFormData {
  last_name: string;
  first_name: string;
  patronymic?: string;
  nickname: string;
  birthday: string;
  is_doctor: boolean;
  work_place?: string;
  career_start_date: number;
  gender?: {
    label: string;
    value: string;
  };
  academy: {
    value: number;
    label: string;
  };
  diploma: File;
  specialization: EditProfileFormDataSpecialization[];
  about_me?: string;
}
