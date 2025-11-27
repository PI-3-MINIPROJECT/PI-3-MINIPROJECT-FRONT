import type { Meeting, CreateMeetingData, MeetingResponse } from '../types';

const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:4000';

/**
 * Makes an HTTP request to the chat server API
 * @template T - Type of the expected response data
 * @param {string} endpoint - API endpoint path
 * @param {RequestInit} [options={}] - Fetch API options
 * @returns {Promise<T>} Promise resolving to API response
 * @throws {Error} Throws error if request fails
 */
async function chatApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const fullUrl = `${CHAT_SERVER_URL}${endpoint}`;
  
  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (options.headers) {
      new Headers(options.headers as HeadersInit).forEach((value, key) => {
        headers.set(key, value);
      });
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(fullUrl, fetchOptions);

    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      throw new Error('Error al procesar la respuesta del servidor');
    }

    if (!response.ok) {
      const errorData = data as { message?: string; error?: string };
      throw new Error(errorData.message || errorData.error || `Error ${response.status}`);
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
}

/**
 * Creates a new meeting in the chat backend
 * @param {CreateMeetingData} meetingData - Meeting creation data
 * @returns {Promise<Meeting>} Promise resolving to created meeting data
 * @throws {Error} Throws error if meeting creation fails
 */
export async function createMeeting(meetingData: CreateMeetingData): Promise<Meeting> {
  const response = await chatApiRequest<MeetingResponse>('/api/meetings', {
    method: 'POST',
    body: JSON.stringify(meetingData),
  });
  
  if (response.success && response.data) {
    return response.data;
  }
  
  throw new Error(response.message || 'Error al crear la reunión');
}

/**
 * Joins an existing meeting
 * @param {string} meetingId - Meeting ID to join
 * @param {string} userId - User ID joining the meeting
 * @returns {Promise<Meeting>} Promise resolving to updated meeting data
 * @throws {Error} Throws error if join fails (e.g., meeting not found, full)
 */
export async function joinMeeting(meetingId: string, userId: string): Promise<Meeting> {
  const response = await chatApiRequest<MeetingResponse>(`/api/meetings/${meetingId}/join`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
  
  if (response.success && response.data) {
    return response.data;
  }
  
  throw new Error(response.message || 'Error al unirse a la reunión');
}

/**
 * Gets meeting information by ID
 * @param {string} meetingId - Meeting ID
 * @returns {Promise<Meeting>} Promise resolving to meeting data
 * @throws {Error} Throws error if meeting not found
 */
export async function getMeetingById(meetingId: string): Promise<Meeting> {
  const response = await chatApiRequest<MeetingResponse>(`/api/meetings/${meetingId}`, {
    method: 'GET',
  });
  
  if (response.success && response.data) {
    return response.data;
  }
  
  throw new Error(response.message || 'Error al obtener la reunión');
}

/**
 * Gets all meetings for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Meeting[]>} Promise resolving to array of meetings
 * @throws {Error} Throws error if request fails
 */
export async function getUserMeetings(userId: string): Promise<Meeting[]> {
  const response = await chatApiRequest<{ success: boolean; data: Meeting[] }>(`/api/meetings/user/${userId}`, {
    method: 'GET',
  });
  
  if (response.success && response.data) {
    return response.data;
  }
  
  throw new Error('Error al obtener las reuniones');
}

/**
 * Leaves a meeting
 * @param {string} meetingId - Meeting ID to leave
 * @param {string} userId - User ID leaving the meeting
 * @returns {Promise<Meeting>} Promise resolving to updated meeting data
 * @throws {Error} Throws error if leave fails
 */
export async function leaveMeeting(meetingId: string, userId: string): Promise<Meeting> {
  const response = await chatApiRequest<MeetingResponse>(`/api/meetings/${meetingId}/leave`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
  
  if (response.success && response.data) {
    return response.data;
  }
  
  throw new Error(response.message || 'Error al salir de la reunión');
}

/**
 * Updates a meeting (only host can update)
 * @param {string} meetingId - Meeting ID to update
 * @param {string} userId - User ID (must be host)
 * @param {Partial<CreateMeetingData>} updates - Fields to update
 * @returns {Promise<Meeting>} Promise resolving to updated meeting data
 * @throws {Error} Throws error if update fails
 */
export async function updateMeeting(
  meetingId: string,
  userId: string,
  updates: Partial<CreateMeetingData>
): Promise<Meeting> {
  const response = await chatApiRequest<MeetingResponse>(`/api/meetings/${meetingId}`, {
    method: 'PUT',
    body: JSON.stringify({ userId, ...updates }),
  });
  
  if (response.success && response.data) {
    return response.data;
  }
  
  throw new Error(response.message || 'Error al actualizar la reunión');
}

/**
 * Deletes a meeting (only host can delete)
 * @param {string} meetingId - Meeting ID to delete
 * @param {string} userId - User ID (must be host)
 * @returns {Promise<void>} Promise resolving when deletion is complete
 * @throws {Error} Throws error if deletion fails
 */
export async function deleteMeeting(meetingId: string, userId: string): Promise<void> {
  const response = await chatApiRequest<{ success: boolean; message: string }>(`/api/meetings/${meetingId}`, {
    method: 'DELETE',
    body: JSON.stringify({ userId }),
  });
  
  if (!response.success) {
    throw new Error(response.message || 'Error al eliminar la reunión');
  }
}

/**
 * Checks if chat server is healthy
 * @returns {Promise<boolean>} Promise resolving to true if server is healthy
 */
export async function checkChatServerHealth(): Promise<boolean> {
  try {
    await chatApiRequest<{ status: string }>('/health', { method: 'GET' });
    return true;
  } catch {
    return false;
  }
}
