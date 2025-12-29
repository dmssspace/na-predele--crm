import { UserRole } from "./auth";

export interface User {
  id: string;
  email: string;
  phone_number?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  email?: string;
  phone_number?: string;
  role?: UserRole;
}
