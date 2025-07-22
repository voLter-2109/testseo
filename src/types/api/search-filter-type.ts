export interface FilterParams {
  ordering?: string; // which field to use when ordering the results
  page?: number; // a page number within the paginated result set
  page_size?: number; // number of results to return per page
}

export interface SearchAndFilterParams extends FilterParams {
  search?: string;
}

export interface SearchParams {
  search?: string;
}

export interface OrderParams {
  ordering?: string;
}

export interface SearchAndFilterChatParams extends SearchAndFilterParams {
  is_active?: boolean;
  is_favorite?: boolean;
}

export interface DoctorsListParams {
  spec_ids?: string;
  category_ids?: string;
  rank_ids?: string;
  gender_ids?: string;
  seniority_min?: string;
  search?: string;
  ordering?: string;
  page?: number; // a page number within the paginated result set
  page_size?: number; // number of results to return per page
}
