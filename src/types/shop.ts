import { AttachMediaRequest } from "./media";

export interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  discount_percent?: number;
  description: string;
  clipping: string;
  image_url: string;
  gallery_url_list: string[];
  attached_media: string[];
  withdrawn: boolean;
  withdrawn_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  title: string;
  price: number;
  discount_percent?: number;
  description: string;
  attached_media: AttachMediaRequest[];
}

export interface UpdateProductRequest {
  title?: string;
  price?: number;
  discount_percent?: number;
  description?: string;
  attached_media?: AttachMediaRequest[];
}

export interface WithdrawProductRequest {
  reason: string;
}
