import axios from 'axios';

const ML_SERVICE_URL = 'http://localhost:8000/api';

export const analysisService = {
  /**
   * Analyze user's journal entries
   */
  async analyzeUserHistory(entries) {
    try {
      // Limit to last 10 entries to avoid timeout
      const recentEntries = entries.slice(0, 10);

      // Transform entries to match ML service format
      const formattedEntries = recentEntries.map(entry => ({
        content: entry.content,
        created_at: entry.createdAt || entry.date,
      }));

      const response = await axios.post(
        `${ML_SERVICE_URL}/analyze-user-history`,
        { entries: formattedEntries },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 120000, // 2 minute timeout (Ollama can be slow)
        }
      );

      if (response.data && response.data.success) {
        return response.data.analysis;
      }

      throw new Error('Invalid response from ML service');
    } catch (error) {
      console.error('Analysis error:', error);

      // Return null if service is unavailable
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        console.log('ML service is not available');
        return null;
      }

      throw error;
    }
  },
};
