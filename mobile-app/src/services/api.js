export const aiAPI = {
    getSmartPrompts: () => api.get('/ai/smart-prompts'),
    getInsights: () => api.get('/ai/insights'),
    refreshInsights: () => api.post('/ai/refresh-insights'), // Force re-analysis
  };