import { TrainingSpec } from "./schedule";
import { User } from "./user";

export interface Trainer {
  id: string;
  user_id?: string;
  short_name: string;
  full_name: string;
  birth_date: string;
  spec: TrainingSpec;
  training_exp_start_on: string;
  gender: "male" | "female";
  regalia: string[];
  approach: string;
  intro_url: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface UpdateTrainerRequest {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  spec?: TrainingSpec;
  training_exp_start_on?: string;
  birth_date?: string;
  gender?: "male" | "female";
  regalia?: string[];
  approach?: string;
  intro_media_id?: string;
  avatar_media_id?: string;
}
