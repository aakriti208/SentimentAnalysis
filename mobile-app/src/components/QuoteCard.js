import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QUOTES = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown"
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown"
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown"
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown"
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Unknown"
  },
  {
    text: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown"
  },
  {
    text: "Do something today that your future self will thank you for.",
    author: "Sean Patrick Flanery"
  }
];

const QuoteCard = () => {
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    // Select a random quote on mount
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[randomIndex]);
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="sparkles" size={20} color="#5B8DEF" />
      </View>
      <Text style={styles.quoteText}>"{quote.text}"</Text>
      <Text style={styles.author}>— {quote.author}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4E7FF',
  },
  iconContainer: {
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    lineHeight: 22,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  author: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B8DEF',
    textAlign: 'right',
  },
});

export default QuoteCard;
