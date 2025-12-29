import { AttachMediaRequest } from "./media";

export type BlogPostStatus = "draft" | "published";
export type BlogPostType = "post" | "video" | "gallery";

export interface BlogPost {
  id: string;
  user_id: string;
  title: string;
  body: string;
  clipping: string;
  slug: string;
  status: BlogPostStatus;
  type: BlogPostType;
  published_at?: string;
  created_at: string;
  updated_at: string;
  categories: BlogCategory[];
  media: BlogMedia[];
  related_posts: BlogPost[];
}

export interface BlogCategory {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface BlogMedia {
  id: string;
  url: string;
  metadata: Record<string, any>;
}

export interface CreateBlogPostRequest {
  title: string;
  body: string;
  type: BlogPostType;
  attached_media: AttachMediaRequest[];
  attached_categories: string[];
}

export interface UpdatePostRequest {
  title?: string;
  body?: string;
  attached_media?: AttachMediaRequest[];
  attached_categories?: string[];
}

export interface CreateBlogCategoryRequest {
  title: string;
}

export interface UpdateBlogCategoryRequest {
  title?: string;
}
