export interface MediaFile {
  id: string;
  url: string;
  public_url: string;
  filename: string;
  mime_type: string;
  type: string;
  size: number;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface MediaUploadResponse {
  data: MediaFile[];
}

export interface MediaListResponse {
  data: MediaFile[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export type MediaType = "image" | "video" | "audio" | "document" | "other";

export const getMediaType = (mimeType: string): MediaType => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType.includes("pdf") ||
    mimeType.includes("document") ||
    mimeType.includes("word") ||
    mimeType.includes("excel") ||
    mimeType.includes("powerpoint")
  ) {
    return "document";
  }
  return "other";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith("image/");
};

export const isVideoFile = (mimeType: string): boolean => {
  return mimeType.startsWith("video/");
};
