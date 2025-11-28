/**
 * User interface representing a user in the system
 */
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

/**
 * Meeting interface representing a video conference meeting from chat backend
 */
export interface Meeting {
  meetingId: string;
  hostId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  estimatedDuration: number;
  maxParticipants: number;
  participants: string[];
  activeParticipants: number;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

/**
 * Request interface for creating a new meeting
 */
export interface CreateMeetingData {
  userId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  estimatedDuration?: number;
  maxParticipants?: number;
}

/**
 * Request interface for joining a meeting
 */
export interface JoinMeetingData {
  userId: string;
  meetingId: string;
}

/**
 * Response interface for meeting operations
 */
export interface MeetingResponse {
  success: boolean;
  message: string;
  data: Meeting;
}

/**
 * Generic API response interface
 * @template T - Type of the data returned in the response
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
  raw?: unknown;
}

/**
 * Request interface for user registration
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  last_name: string;
  age: number;
}

/**
 * Request interface for user login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Response interface for authentication operations
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
}

/**
 * Request interface for updating user password
 */
export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

