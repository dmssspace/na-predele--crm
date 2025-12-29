import { Customer } from "./customer";

export interface TicketPlan {
  id: string;
  name: string;
  description?: string;
  type: "club" | "personal";
  metadata?: Record<string, any>; // TODO: В метаданных может быть значение "theme" со значениями "default", "accent", "yellow"
  created_at: string;
  updated_at?: string;
  packages: TicketPlanPackage[];
}

export interface TicketPlanPackage {
  id: string;
  plan_id: string;
  trainer_id?: string;
  duration_days?: number;
  total_sessions?: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  plan?: TicketPlan;
}

export interface Ticket {
  id: string;
  customer_id: string;
  plan_package_id: string;
  start_date: string;
  end_date: string;
  remaining_sessions?: number;
  status: "active" | "frozen" | "expired";
  created_at: string;
  updated_at?: string;
  package?: TicketPlanPackage;
  customer?: Customer;
}

export interface CreatePlanRequest {
  name: string;
  description?: string;
  type: "club" | "personal";
  metadata?: Record<string, any>; // TODO: В метаданных может быть значение "theme" со значениями "default", "accent", "yellow"
}

export interface UpdatePlanRequest {
  name?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface CreatePlanPackageRequest {
  trainer_id?: string;
  duration_days?: number;
  total_sessions?: number;
  price: number;
}

export interface UpdatePlanPackageRequest {
  duration_days?: number;
  total_sessions?: number;
  price?: number;
}

export interface TogglePlanPackageRequest {
  is_active: boolean;
}

export interface CreateTicketRequest {
  customer_id: string;
  package_id: string;
}

export interface TicketFreezeRequest {
  duration: string; // Note: 1d, 2w, 3m
}
