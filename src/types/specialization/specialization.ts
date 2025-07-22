

export interface DoctorSpecializationProps {
  specialization_id: number;
  title?: string;
  file: File;
  expiration_date: number;
}

export interface SpecializationsListItem {
  id: number;
  name: string;
}
