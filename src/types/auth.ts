import { TrainingSpec } from "./schedule";

export type UserRole = "admin" | "moderator" | "trainer" | "customer";

export interface Me {
  id: string;
  role: UserRole;
  email: string;
  phone_number?: string;
  customer_profile?: CustomerProfile;
  trainer_profile?: TrainerProfile;
}

export interface CustomerProfile {
  id: string;
  short_name: string;
  full_name: string;
  birth_date: string;
  gender: string;
}

export interface TrainerProfile {
  id: string;
  short_name: string;
  full_name: string;
  birth_date: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface RegisterCustomerRequest {
  email: string;
  phone_number: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  birth_date: string;
  gender: "male" | "female";
}

export interface RegisterTrainerRequest {
  email: string;
  phone_number: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  birth_date: string;
  gender: "male" | "female";
  spec: TrainingSpec;
  training_exp_start_on: string;
  regalia: string[];
  approach: string;
  intro_media_id: string;
  avatar_media_id: string;
}
