export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp?: string;
  path?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
