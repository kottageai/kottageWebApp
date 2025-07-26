import { supabaseAdmin } from "../util/supabase";
import { Profile, CreateProfileData, ProfileSchema } from "../types/profiles";

export class ProfilesService {
  async getProfile(id: string): Promise<Profile | null> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data ? ProfileSchema.parse(data) : null;
  }

  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }
    return (data || []).map(profile => ProfileSchema.parse(profile));
  }

  async createProfile(id: string, profileData: CreateProfileData): Promise<Profile> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert({ id, ...profileData })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return ProfileSchema.parse(data);
  }

  async deleteProfile(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}