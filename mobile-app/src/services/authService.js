import { supabase } from '../config/supabase';

export const authService = {
  /**
   * Register a new user
   * Profile is automatically created via Supabase trigger
   */
  async register(email, password, name) {
    try {
      // Sign up the user with metadata
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // Wait for the trigger to create the profile (with retries)
      let profile = null;
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts && !profile) {
        await new Promise(resolve => setTimeout(resolve, 500 * (attempts + 1)));

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (data) {
          profile = data;
          break;
        }

        if (error && error.code !== 'PGRST116') {
          console.error('Profile fetch error:', error);
        }

        attempts++;
      }

      // If profile still doesn't exist after retries, create it manually
      if (!profile) {
        console.log('Profile not found, creating manually...');

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              name,
              email,
              avatar: null,
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error('Manual profile creation error:', createError);
          // If manual creation fails, return user data without profile
          return {
            user: {
              id: authData.user.id,
              email: authData.user.email,
              name,
              avatar: null,
            },
            token: authData.session?.access_token,
          };
        }

        profile = newProfile;
      }

      return {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: profile.name,
          avatar: profile.avatar,
        },
        token: authData.session?.access_token,
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: profile.name,
          avatar: profile.avatar,
        },
        token: authData.session?.access_token,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      console.log('🔵 authService.logout() - Calling supabase.auth.signOut()');
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('🔵 Supabase signOut error:', error);
        throw error;
      }

      console.log('🔵 Supabase signOut successful - session cleared');
    } catch (error) {
      console.error('🔵 authService.logout() error:', error);
      throw error;
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) return null;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: user.id,
        email: user.email,
        name: profile.name,
        avatar: profile.avatar,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Upload avatar image
   */
  async uploadAvatar(userId, imageUri) {
    try {
      // Create a unique file name
      const fileExt = imageUri.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Convert image to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      await this.updateProfile(userId, { avatar: publicUrl });

      return publicUrl;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  },
};
