import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';
import { aiAPI } from '../services/api';

export default function TestMLScreen() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    setLoading(true);
    try {
      const response = await aiAPI.classifyEntry(text);
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Test ML Integration</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Write a journal entry..."
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={6}
      />
      
      <Button 
        title={loading ? "Analyzing..." : "Analyze Entry"} 
        onPress={analyzeText}
        disabled={loading || !text}
      />
      
      {result && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Results:</Text>
          <Text>{JSON.stringify(result, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginBottom: 20,
    minHeight: 120,
    textAlignVertical: 'top'
  },
  result: { 
    marginTop: 20, 
    padding: 15, 
    backgroundColor: '#f0f0f0',
    borderRadius: 8
  },
  resultTitle: { 
    fontWeight: 'bold', 
    marginBottom: 10,
    fontSize: 16
  }
});