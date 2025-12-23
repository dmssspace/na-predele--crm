export type UserRole = "admin" | "moderator" | "trainer" | "customer";

export interface User {
  id: string;
  email: string;
  phone_number?: string;
  role: UserRole;
}

export interface Customer {
  id: string;
  user_id: string;
  full_name: string;
  short_name: string;
  birth_date: string;
  gender: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface Trainer {
  id: string;
  user_id: string;
  full_name: string;
  short_name: string;
  spec: string;
  training_exp_start_on: string;
  birth_date: string;
  gender: string;
  regalia: string[];
  approach: string;
  intro_url: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  user: User;
}
