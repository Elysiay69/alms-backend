export type Nullable<T> = T | null;

export interface ApiResponse<T> {
  statusCode: number; // Added statusCode for HTTP responses
  data?: Nullable<T>;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface UserResponse {
  id: string;
  username: string;
  officeName: string;
  email?: string;
  phoneNo?: string;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListItemResponse {
  id: string;
  username: string;
  email?: string;
  role: string;
}
