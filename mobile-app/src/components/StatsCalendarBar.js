import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { selectEntryCount, selectCurrentStreak } from '../store/journalSlice';

const StatsCalendarBar = ({ onCalendarPress }) => {
  const entryCount = useSelector(selectEntryCount);
  const currentStreak = useSelector(selectCurrentStreak);

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{entryCount}</Text>
          <Text style={styles.statLabel}>Entries</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.calendarButton}
        onPress={onCalendarPress}
        activeOpacity={0.7}
      >
        <Ionicons name="calendar-outline" size={20} color="#5B8DEF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF2',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#D1D5DB',
  },
  calendarButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EEF4FF',
  },
});

export default StatsCalendarBar;
