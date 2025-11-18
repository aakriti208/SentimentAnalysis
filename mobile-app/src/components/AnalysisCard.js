import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AnalysisCard = ({ analysis, loading }) => {
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#5B8DEF" />
        <Text style={styles.loadingText}>Analyzing your journal...</Text>
      </View>
    );
  }

  if (!analysis) {
    return (
      <View style={styles.card}>
        <Ionicons name="analytics-outline" size={48} color="#9CA3AF" />
        <Text style={styles.emptyTitle}>No Analysis Available</Text>
        <Text style={styles.emptySubtext}>
          Write more entries to get personalized insights
        </Text>
      </View>
    );
  }

  const { themes, sentiment_trends, patterns } = analysis;

  // Get sentiment emoji and color
  const getSentimentInfo = () => {
    if (!sentiment_trends?.overall) return { emoji: '😊', color: '#6B7280', text: 'Neutral' };

    const { positive_percentage } = sentiment_trends.overall;
    if (positive_percentage >= 70) {
      return { emoji: '😊', color: '#10B981', text: 'Mostly Positive' };
    } else if (positive_percentage >= 40) {
      return { emoji: '😐', color: '#F59E0B', text: 'Mixed' };
    } else {
      return { emoji: '😔', color: '#EF4444', text: 'Needs Attention' };
    }
  };

  const sentimentInfo = getSentimentInfo();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="analytics" size={24} color="#5B8DEF" />
        <Text style={styles.title}>Your Journal Insights</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Sentiment Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Sentiment</Text>
          <View style={styles.sentimentContainer}>
            <Text style={styles.sentimentEmoji}>{sentimentInfo.emoji}</Text>
            <View style={styles.sentimentInfo}>
              <Text style={[styles.sentimentText, { color: sentimentInfo.color }]}>
                {sentimentInfo.text}
              </Text>
              {sentiment_trends?.overall && (
                <Text style={styles.sentimentDetail}>
                  {sentiment_trends.overall.positive_percentage}% positive entries
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Top Themes */}
        {themes && themes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Themes</Text>
            <View style={styles.themesContainer}>
              {themes.slice(0, 3).map((theme, index) => (
                <View key={index} style={styles.themeItem}>
                  <View style={styles.themeHeader}>
                    <Text style={styles.themeName}>
                      {theme.theme.replace(/_/g, ' ')}
                    </Text>
                    <Text style={styles.themePercentage}>{theme.percentage}%</Text>
                  </View>
                  <View style={styles.themeBar}>
                    <View
                      style={[
                        styles.themeBarFill,
                        { width: `${theme.percentage}%` },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Patterns */}
        {patterns && patterns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insights</Text>
            {patterns.map((pattern, index) => (
              <View key={index} style={styles.patternItem}>
                <Ionicons
                  name="bulb-outline"
                  size={16}
                  color="#5B8DEF"
                  style={styles.patternIcon}
                />
                <Text style={styles.patternText}>{pattern.message}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    minHeight: 280,
    maxHeight: '40%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sentimentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  sentimentEmoji: {
    fontSize: 40,
  },
  sentimentInfo: {
    flex: 1,
  },
  sentimentText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sentimentDetail: {
    fontSize: 14,
    color: '#6B7280',
  },
  themesContainer: {
    gap: 12,
  },
  themeItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  themeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textTransform: 'capitalize',
  },
  themePercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B8DEF',
  },
  themeBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  themeBarFill: {
    height: '100%',
    backgroundColor: '#5B8DEF',
    borderRadius: 3,
  },
  patternItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 8,
  },
  patternIcon: {
    marginTop: 2,
  },
  patternText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default AnalysisCard;
