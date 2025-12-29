import { User } from "./user";

export type CallbackType =
  | "trainer_request"
  | "trainer_signup"
  | "ticket_request"
  | "trial";
export type CallbackStatus = "new" | "processing" | "completed";

export interface CallbackRequest {
  id: string;
  user_full_name: string;
  user_phone_number: string;
  user_email?: string;
  consent_to_personal_data_processing: boolean;
  type: CallbackType;
  status: CallbackStatus;
  comment?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  assignee_user?: User;
}

export interface SubmitCallbackRequest {
  full_name: string;
  phone_number: string;
  email?: string;
  consent_to_personal_data_processing: boolean;
  type: CallbackType;
  metadata?: Record<string, any>;
}

export interface SolveCallbackRequest {
  comment?: string;
}
