export interface User {
  uid: string;
  email: string;
  name: string;
  last_name: string;
  age: number;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
  accessToken?: string;
}

export interface Meeting {
  id: string;
  hostId: string;
  title: string;
  createdAt: Date;
  participants: string[];
  status: 'active' | 'ended';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
  raw?: unknown;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  last_name: string;
  age: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

