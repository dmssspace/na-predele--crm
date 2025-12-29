export type MediaType = "image" | "video" | "file";
export type MediaStatus = "pending" | "ready" | "failed";

export interface Media {
  id: string;
  user_id: string;
  type: MediaType;
  status: MediaStatus;
  public_url: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UpdateMediaRequest {
  metadata?: Record<string, any>;
}

export interface AttachMediaRequest {
  media_id: string;
  role: "cover" | "gallery" | "avatar" | "video_cover" | "thumbnail";
  sort_order: number;
  metadata: Record<string, any>;
}
