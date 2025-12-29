import { User } from "./user";

export interface Customer {
  id: string;
  user_id?: string;
  full_name: string;
  short_name: string;
  birth_date: string;
  gender: "male" | "female";
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface UpdateCustomerRequest {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  birth_date?: string;
  gender?: "male" | "female";
  avatar_media_id?: string;
}
