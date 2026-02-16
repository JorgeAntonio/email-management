export interface IResApi<T> {
  status: number;
  data?: T;
  errors?: string[];
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  status: number;
  errors: string[];
  message?: string;
}
