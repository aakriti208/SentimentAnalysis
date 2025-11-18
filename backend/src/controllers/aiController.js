exports.getUserInsights = async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Get ALL user entries (or last 100 for performance)
      const { data: entries, error } = await supabase
        .from('journals')
        .select('id, content, ai_themes, ai_sentiment, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(100);
  
      if (error) throw error;
  
      if (!entries || entries.length === 0) {
        return res.json({
          success: true,
          message: 'No entries found. Start journaling to see insights!',
          totalEntries: 0
        });
      }
  
      // Send to ML service for comprehensive analysis
      const mlResponse = await axios.post(
        `${ML_SERVICE_URL}/analyze-user-history`,
        { entries: entries },
        { timeout: 30000 }  // 30 second timeout for batch processing
      );
  
      const analysis = mlResponse.data.analysis;
  
      // Generate personalized insights
      const insights = generatePersonalizedInsights(analysis, entries.length);
  
      res.json({
        success: true,
        totalEntries: entries.length,
        themes: analysis.themes,
        sentimentTrends: analysis.sentiment_trends,
        patterns: analysis.patterns,
        timeline: analysis.timeline,
        insights: insights,
        lastAnalyzed: new Date().toISOString()
      });
  
    } catch (error) {
      console.error('Insights error:', error.message);
      
      // Fallback: Use stored ai_themes if ML service fails
      try {
        const { data: entries, error: dbError } = await supabase
          .from('journals')
          .select('ai_themes, ai_sentiment, created_at')
          .eq('user_id', req.user.id)
          .not('ai_themes', 'is', null);
  
        if (dbError) throw dbError;
  
        // Basic analysis from stored data
        const themeCount = {};
        const sentimentCount = { positive: 0, negative: 0, neutral: 0 };
  
        entries.forEach(entry => {
          if (entry.ai_themes) {
            entry.ai_themes.forEach(theme => {
              themeCount[theme] = (themeCount[theme] || 0) + 1;
            });
          }
          if (entry.ai_sentiment) {
            sentimentCount[entry.ai_sentiment]++;
          }
        });
  
        const topThemes = Object.entries(themeCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([theme, count]) => ({ 
            theme, 
            count,
            percentage: Math.round((count / entries.length) * 100)
          }));
  
        res.json({
          success: true,
          totalEntries: entries.length,
          themes: topThemes,
          sentimentTrends: { overall: sentimentCount },
          fallbackMode: true
        });
  
      } catch (fallbackError) {
        res.status(500).json({ error: 'Failed to generate insights' });
      }
    }
  };
  
  function generatePersonalizedInsights(analysis, totalEntries) {
    const insights = [];
  
    // Theme insights
    if (analysis.themes && analysis.themes.length > 0) {
      const topTheme = analysis.themes[0];
      
      insights.push({
        type: 'primary_theme',
        title: `Your Main Focus: ${capitalize(topTheme.theme)}`,
        description: `${topTheme.percentage}% of your entries explore ${topTheme.theme}. ${getThemeInsight(topTheme.theme)}`,
        icon: getThemeIcon(topTheme.theme)
      });
  
      // Trend insight
      if (topTheme.trend === 'increasing') {
        insights.push({
          type: 'trend',
          title: '📈 Growing Interest',
          description: `You're writing more about ${topTheme.theme} lately. This shows growing awareness in this area.`
        });
      }
    }
  
    // Sentiment insights
    if (analysis.sentiment_trends) {
      const sentiment = analysis.sentiment_trends.overall;
      const positivePercent = sentiment.positive_percentage;
  
      if (positivePercent >= 60) {
        insights.push({
          type: 'sentiment',
          title: '😊 Positive Outlook',
          description: `${positivePercent}% of your entries reflect positive emotions. Keep nurturing this mindset!`
        });
      } else if (positivePercent < 40) {
        insights.push({
          type: 'sentiment',
          title: '🤗 Processing Challenges',
          description: `Your entries show you're working through some difficulties. Journaling is a great way to process emotions.`
        });
      }
  
      // Recent trend
      if (analysis.sentiment_trends.recent_trend === 'mostly_positive') {
        insights.push({
          type: 'recent',
          title: '✨ Recent Positivity',
          description: 'Your recent entries show an upward trend in positive emotions.'
        });
      }
    }
  
    // Patterns
    if (analysis.patterns) {
      analysis.patterns.forEach(pattern => {
        insights.push({
          type: pattern.type,
          title: getPatternTitle(pattern.type),
          description: pattern.message
        });
      });
    }
  
    // Milestone insights
    if (totalEntries >= 50) {
      insights.push({
        type: 'milestone',
        title: '🎉 Milestone Achieved!',
        description: `You've written ${totalEntries} entries. That's incredible dedication to self-reflection!`
      });
    }
  
    return insights;
  }
  
  function getThemeInsight(theme) {
    const insights = {
      'gratitude': 'Practicing gratitude is linked to increased happiness and wellbeing.',
      'relationships': 'Reflecting on relationships helps strengthen your connections.',
      'personal_growth': 'You\'re actively working on becoming your best self.',
      'stress': 'Writing about stress is a healthy way to process and manage it.',
      'work': 'Reflecting on your professional life helps clarify your career goals.',
      'health': 'Awareness of your health is the first step to positive changes.',
      'daily_life': 'Finding meaning in everyday moments enriches your life.'
    };
    return insights[theme] || 'This is an important area of your life.';
  }
  
  function getThemeIcon(theme) {
    const icons = {
      'gratitude': '🙏',
      'relationships': '❤️',
      'personal_growth': '🌱',
      'stress': '😰',
      'work': '💼',
      'health': '🏃',
      'daily_life': '📅'
    };
    return icons[theme] || '✨';
  }
  
  function getPatternTitle(type) {
    const titles = {
      'consistency': '📊 Writing Consistency',
      'diversity': '🎨 Theme Diversity',
      'recent_focus': '🔍 Current Focus'
    };
    return titles[type] || 'Pattern Detected';
  }
  
  function capitalize(str) {
    return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }