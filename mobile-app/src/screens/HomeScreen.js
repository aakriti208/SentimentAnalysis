import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text, Modal, ActivityIndicator, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Greeting from '../components/Greeting';
import StatsCalendarBar from '../components/StatsCalendarBar';
import FloatingAddButton from '../components/FloatingAddButton';
import JournalCalendar from '../components/JournalCalendar';
import JournalCard from '../components/JournalCard';
import QuoteCard from '../components/QuoteCard';
import { selectAllEntries, deleteEntry, setEntries } from '../store/journalSlice';
import { selectUser } from '../store/userSlice';
import { journalService } from '../services/journalService';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const entries = useSelector(selectAllEntries);
  const user = useSelector(selectUser);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load entries from Supabase when component mounts
  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedEntries = await journalService.getEntries(user.id);

      // Transform entries to match Redux format
      const transformedEntries = fetchedEntries.map(entry => ({
        id: entry.id,
        title: entry.title,
        content: entry.content,
        date: entry.date,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
      }));

      dispatch(setEntries(transformedEntries));
    } catch (error) {
      console.error('Load entries error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = () => {
    navigation.navigate('NewEntry');
  };

  const handleCalendarPress = () => {
    setCalendarVisible(true);
  };

  const handleDayPress = (day) => {
    console.log('Day pressed:', day.dateString);
    setCalendarVisible(false);
    // navigation.navigate('DayEntries', { date: day.dateString });
  };

  const handleCardPress = (entry) => {
    console.log('Card pressed:', entry);
    // navigation.navigate('EntryDetail', { entryId: entry.id });
  };

  const handleEdit = (entry) => {
    console.log('Edit entry:', entry);
    // navigation.navigate('EditEntry', { entryId: entry.id });
  };

  const handleDelete = async (entry) => {
    try {
      await journalService.deleteEntry(entry.id);
      dispatch(deleteEntry(entry.id));
    } catch (error) {
      console.error('Delete entry error:', error);
      Alert.alert('Error', 'Failed to delete entry. Please try again.');
    }
  };

  const handleAvatarPress = () => {
    navigation.navigate('Profile');
  };

  const renderEntry = ({ item }) => (
    <JournalCard
      entry={item}
      onPress={handleCardPress}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );

  const renderHeader = () => (
    <>
      <QuoteCard />
      <Text style={styles.sectionTitle}>Your Entries</Text>
    </>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5B8DEF" />
          <Text style={styles.loadingText}>Loading your entries...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No journal entries yet</Text>
        <Text style={styles.emptySubtext}>Tap the + button to start writing</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Greeting
          userName={user?.name || 'there'}
          userAvatar={user?.avatar}
          onAvatarPress={handleAvatarPress}
        />
        <StatsCalendarBar onCalendarPress={handleCalendarPress} />

        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
        />

        <FloatingAddButton onPress={handleAddEntry} />

        <Modal
          visible={calendarVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setCalendarVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.calendarModal}>
              <JournalCalendar
                onDayPress={handleDayPress}
                onClose={() => setCalendarVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    marginHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    width: '90%',
    maxWidth: 400,
  },
});

export default HomeScreen;
