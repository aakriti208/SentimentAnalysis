import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectEntryCount, selectCurrentStreak } from '../store/journalSlice';

const JournalStats = () => {
  const entryCount = useSelector(selectEntryCount);
  const currentStreak = useSelector(selectCurrentStreak);

  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{entryCount}</Text>
        <Text style={styles.statLabel}>
          {entryCount === 1 ? 'Entry' : 'Entries'}
        </Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{currentStreak}</Text>
        <Text style={styles.statLabel}>
          Day {currentStreak === 1 ? 'Streak' : 'Streak'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8ECF2',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#5B8DEF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default JournalStats;
