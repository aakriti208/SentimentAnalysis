import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTimeGreeting } from '../utils/timeGreeting';

const Greeting = ({ userName = 'there', userAvatar, onAvatarPress }) => {
  const [greeting, setGreeting] = useState(getTimeGreeting());

  useEffect(() => {
    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getTimeGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting}</Text>

      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={onAvatarPress}
        activeOpacity={0.7}
      >
        {userAvatar ? (
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF2',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#5B8DEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Greeting;
