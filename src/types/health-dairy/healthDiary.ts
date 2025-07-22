import { BaseListProps } from '../api/serverResponse';
import { DoctorInfo } from '../doctor/doctor';

export interface HealthDiaryEntriesListItem {
  id: number;
  content: string;
  status: 'draft' | 'publish';
  created_at: number;
  updated_at: number;
}

export interface HealthDiaryEntriesList extends BaseListProps {
  results: HealthDiaryEntriesListItem[];
}

export interface HealthDiaryCommentsListItem {
  id: number;
  health_diary: number;
  doctor: DoctorInfo;
  content: string;
  status: 'draft' | 'status';
  created_at: number;
  updated_at: number;
}

export interface HealthDiaryCommentsList extends BaseListProps {
  results: HealthDiaryCommentsListItem[];
}
