export interface ApiResponse<T = undefined> {
  data?: T;
  status: number;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    total: number;
    per_page: number;
    page: number;
    last_page: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  errors?: ApiErrorInstance[];
}

export interface ApiErrorInstance {
  success: boolean;
  field: string;
  value: any;
  tag: string;
}
