import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addEntry } from '../store/journalSlice';
import { selectUser } from '../store/userSlice';
import { journalService } from '../services/journalService';

const NewEntryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to save entries.');
      return;
    }

    setSaving(true);

    try {
      const entryData = {
        title: title.trim() || 'Untitled',
        content: content.trim(),
        date: new Date().toISOString(),
      };

      const savedEntry = await journalService.createEntry(user.id, entryData);

      // Add to Redux store
      dispatch(addEntry({
        id: savedEntry.id,
        title: savedEntry.title,
        content: savedEntry.content,
        date: savedEntry.date,
        createdAt: savedEntry.created_at,
        updatedAt: savedEntry.updated_at,
      }));

      navigation.goBack();
    } catch (error) {
      console.error('Save entry error:', error);
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Simply go back to home page without saving
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleCancel}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color="#1a1a1a" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>New Entry</Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSave}
            disabled={saving}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#5B8DEF" />
            ) : (
              <Ionicons name="checkmark" size={28} color="#5B8DEF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <TextInput
            style={styles.contentInput}
            placeholder="What's on your mind?"
            placeholderTextColor="#9CA3AF"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF2',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    paddingVertical: 8,
  },
  contentInput: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1a1a1a',
    lineHeight: 24,
    minHeight: 200,
  },
});

export default NewEntryScreen;
