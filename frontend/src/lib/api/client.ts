import { supabase } from '@/lib/supabase/client';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  }

  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No authenticated session');
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  async get(endpoint: string) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `GET ${endpoint} failed`);
    }
    
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `POST ${endpoint} failed`);
    }
    
    return response.json();
  }

  async put(endpoint: string, data: any) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `PUT ${endpoint} failed`);
    }
    
    return response.json();
  }

  async delete(endpoint: string) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `DELETE ${endpoint} failed`);
    }
    
    return response.status === 204 ? null : response.json();
  }
}

export const apiClient = new ApiClient();