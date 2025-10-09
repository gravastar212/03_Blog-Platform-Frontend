export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar?: string;
  coverImage?: string;
  tags: string[];
  category: string;
  publishedDate: Date;
  updatedDate?: Date;
  readTime: number; // in minutes
  likes: number;
  views: number;
  featured: boolean;
}
