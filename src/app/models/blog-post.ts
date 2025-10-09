export interface Author {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Author | string; // Can be object from backend or string
  authorAvatar?: string;
  coverImage?: string;
  tags: string[];
  category: Category | string; // Can be object from backend or string
  publishedDate: Date;
  updatedDate?: Date;
  readTime: number; // in minutes
  likes: number;
  views: number;
  featured: boolean;
  published?: boolean;
  authorId?: number;
  categoryId?: number;
}
