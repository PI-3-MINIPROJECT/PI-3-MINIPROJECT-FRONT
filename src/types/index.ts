/**
 * Type definitions for the application
 */

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Meeting interface
 */
export interface Meeting {
  id: string;
  hostId: string;
  title: string;
  createdAt: Date;
  participants: string[];
  status: 'active' | 'ended';
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

