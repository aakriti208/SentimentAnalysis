import { supabase } from '../config/supabase';

export const journalService = {
  /**
   * Get all journal entries for a user (excluding drafts by default)
   */
  async getEntries(userId, includeDrafts = false) {
    try {
      let query = supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId);

      // By default, exclude drafts
      if (!includeDrafts) {
        query = query.eq('is_draft', false);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get entries error:', error);
      throw error;
    }
  },

  /**
   * Get a single journal entry
   */
  async getEntry(entryId) {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', entryId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get entry error:', error);
      throw error;
    }
  },

  /**
   * Create a new journal entry
   */
  async createEntry(userId, entryData) {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([
          {
            user_id: userId,
            title: entryData.title,
            content: entryData.content,
            is_draft: entryData.isDraft || false,
            date: entryData.date || new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create entry error:', error);
      throw error;
    }
  },

  /**
   * Update a journal entry
   */
  async updateEntry(entryId, updates) {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entryId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update entry error:', error);
      throw error;
    }
  },

  /**
   * Delete a journal entry
   */
  async deleteEntry(entryId) {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete entry error:', error);
      throw error;
    }
  },

  /**
   * Get entries for a specific date
   */
  async getEntriesByDate(userId, date) {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('date', `${date}T00:00:00`)
        .lte('date', `${date}T23:59:59`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get entries by date error:', error);
      throw error;
    }
  },

  /**
   * Get entry count for a user (excluding drafts)
   */
  async getEntryCount(userId) {
    try {
      const { count, error } = await supabase
        .from('journal_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_draft', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Get entry count error:', error);
      throw error;
    }
  },

  /**
   * Get draft entries for a user
   */
  async getDrafts(userId) {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('is_draft', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get drafts error:', error);
      throw error;
    }
  },

  /**
   * Publish a draft (convert to published entry)
   */
  async publishDraft(entryId) {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update({ is_draft: false })
        .eq('id', entryId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Publish draft error:', error);
      throw error;
    }
  },
};
