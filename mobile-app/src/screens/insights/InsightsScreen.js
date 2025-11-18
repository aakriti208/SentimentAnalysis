import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { aiAPI } from '../../services/api';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await aiAPI.getInsights();
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Analyzing your entries...</Text>
      </View>
    );
  }

  if (!insights || insights.totalEntries === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Start journaling to see your insights!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Insights</Text>
      
      {/* Header Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{insights.totalEntries}</Text>
          <Text style={styles.statLabel}>Total Entries</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {insights.themes?.[0]?.count || 0}
          </Text>
          <Text style={styles.statLabel}>Top Theme</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {insights.sentimentTrends?.overall?.positive_percentage || 0}%
          </Text>
          <Text style={styles.statLabel}>Positive</Text>
        </View>
      </View>

      {/* Personalized Insights */}
      {insights.insights && insights.insights.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Key Insights</Text>
          {insights.insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <Text style={styles.insightTitle}>
                {insight.icon} {insight.title}
              </Text>
              <Text style={styles.insightDescription}>
                {insight.description}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Top Themes */}
      {insights.themes && insights.themes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Your Themes</Text>
          {insights.themes.map((theme, index) => (
            <View key={index} style={styles.themeRow}>
              <View style={styles.themeInfo}>
                <Text style={styles.themeName}>
                  {capitalizeTheme(theme.theme)}
                </Text>
                <Text style={styles.themeCount}>
                  {theme.count} entries ({theme.percentage}%)
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${theme.percentage}%` }
                  ]} 
                />
              </View>
              {theme.trend && (
                <Text style={styles.themeTrend}>
                  {getTrendEmoji(theme.trend)} {theme.trend}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Sentiment Analysis */}
      {insights.sentimentTrends?.overall && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💭 Emotional Tone</Text>
          <View style={styles.sentimentCard}>
            <SentimentBar 
              label="Positive" 
              count={insights.sentimentTrends.overall.positive}
              total={insights.totalEntries}
              color="#4CAF50"
            />
            <SentimentBar 
              label="Neutral" 
              count={insights.sentimentTrends.overall.neutral}
              total={insights.totalEntries}
              color="#FFC107"
            />
            <SentimentBar 
              label="Negative" 
              count={insights.sentimentTrends.overall.negative}
              total={insights.totalEntries}
              color="#F44336"
            />
          </View>
          
          {insights.sentimentTrends.recent_trend && (
            <Text style={styles.trendText}>
              Recent trend: {insights.sentimentTrends.recent_trend.replace('_', ' ')}
            </Text>
          )}
        </View>
      )}

      {/* Patterns */}
      {insights.patterns && insights.patterns.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Writing Patterns</Text>
          {insights.patterns.map((pattern, index) => (
            <View key={index} style={styles.patternCard}>
              <Text style={styles.patternMessage}>{pattern.message}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.footer}>
        Last analyzed: {new Date(insights.lastAnalyzed).toLocaleDateString()}
      </Text>
    </ScrollView>
  );
}

function SentimentBar({ label, count, total, color }) {
  const percentage = Math.round((count / total) * 100);
  
  return (
    <View style={styles.sentimentRow}>
      <Text style={styles.sentimentLabel}>{label}</Text>
      <View style={styles.sentimentBarContainer}>
        <View 
          style={[
            styles.sentimentBar, 
            { width: `${percentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <Text style={styles.sentimentCount}>{count}</Text>
    </View>
  );
}

function capitalizeTheme(theme) {
  return theme.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getTrendEmoji(trend) {
  return trend === 'increasing' ? '📈' : trend === 'decreasing' ? '📉' : '➡️';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  insightCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  themeRow: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  themeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeCount: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  themeTrend: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  sentimentCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  sentimentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sentimentLabel: {
    width: 70,
    fontSize: 14,
    fontWeight: '500',
  },
  sentimentBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  sentimentBar: {
    height: '100%',
    borderRadius: 10,
  },
  sentimentCount: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  trendText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 5,
  },
  patternCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  patternMessage: {
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 40,
  },
});