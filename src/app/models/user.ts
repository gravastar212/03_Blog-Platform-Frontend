export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'author' | 'reader';
  avatar?: string;
  createdAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
