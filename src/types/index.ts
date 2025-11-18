export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
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
}

