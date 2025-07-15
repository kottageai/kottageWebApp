import { supabase } from './supabase/client';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-backend.com' 
  : 'http://localhost:4000';

class ApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      let message = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        const err = errorData.error ?? errorData.message ?? errorData;
        if (typeof err === 'string') {
          message = err;
        } else if (Array.isArray(err)) {
          // Zod issues array
          message = err.map((iss: any) => iss.message || JSON.stringify(iss)).join(', ');
        } else if (err && typeof err === 'object') {
          message = JSON.stringify(err);
        }
      } catch (_) {
        // response not JSON or parse failed, keep default message
      }
      throw new Error(message);
    }
    return response.json();
  }

  private async getAuthData() {
    // Try to get the current session first
    const { data: { session } } = await supabase.auth.getSession();

    if (session && session.user) {
      return { token: session.access_token, user: session.user };
    }

    // Fallback: if there's no active session (e.g., email confirmation required),
    // check if we still have a user object
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('User session not found.');
    }
    return { token: null, user };
  }

  async post(endpoint: string, data: any) {
    const { token, user } = await this.getAuthData();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ ...data, user }),
    });
    return this.handleResponse(response);
  }

  async get(endpoint: string) {
    const { token } = await this.getAuthData();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });
    return this.handleResponse(response);
  }

  async put(endpoint: string, data: any) {
    const { token, user } = await this.getAuthData();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ ...data, user }),
    });
    return this.handleResponse(response);
  }

  async delete(endpoint: string) {
    const { token } = await this.getAuthData();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });
    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();

// Specific API methods
export const profileApi = {
  create: (profileData: {
    full_name: string;
    phone: string;
    home_address?: string;
    is_provider: boolean;
  }) => apiClient.post('/api/profiles', { profileData }),

  get: () => apiClient.get('/api/profiles'),

  update: (profileData: Partial<{
    full_name: string;
    phone: string;
    home_address: string;
    is_provider: boolean;
  }>) => apiClient.put('/api/profiles', { profileData }),
}; 