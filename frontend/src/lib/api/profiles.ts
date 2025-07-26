import { apiClient } from "./client";
import { supabase } from "@/lib/supabase/client";

interface ProfileData {
  full_name: string;
  phone?: string;
  email?: string;
  home_address?: string;
  avatar_url?: string;
  is_provider?: boolean;
}

export const profilesApi = {
  async getProfile(userId: string) {
    return apiClient.get(`/profiles/${userId}`);
  },

  async getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    return apiClient.get(`/profiles/${user.id}`);
  },

  async createProfile(data: ProfileData) {
    return apiClient.post('/profiles', data);
  },

  async updateProfile(userId: string, data: Partial<ProfileData>) {
    return apiClient.put(`/profiles/${userId}`, data);
  },

  async updateCurrentUserProfile(data: Partial<ProfileData>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    return apiClient.put(`/profiles/${user.id}`, data);
  },

  async deleteProfile(userId: string) {
    return apiClient.delete(`/profiles/${userId}`);
  },

  // Helper that handles create or update logic
  async createOrUpdateProfile(data: ProfileData) {
    try {
      const profile = await this.getCurrentUserProfile();
      // Profile exists, update it
      return await this.updateCurrentUserProfile(data);
    } catch (error) {
      // Profile doesn't exist, create it
      return await this.createProfile(data);
    }
  }
};