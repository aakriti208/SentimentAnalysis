import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './src/store';
import HomeScreen from './src/screens/HomeScreen';
import NewEntryScreen from './src/screens/NewEntryScreen';
import EntryDetailScreen from './src/screens/EntryDetailScreen';
import EditEntryScreen from './src/screens/EditEntryScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { selectIsAuthenticated } from './src/store/userSlice';

const Stack = createStackNavigator();

// Linking configuration for web URLs
const linking = {
  prefixes: ['http://localhost:8081', 'exp://'],
  config: {
    screens: {
      // Auth screens
      Login: 'login',
      Register: 'register',

      // App screens
      Home: '',
      NewEntry: 'new-entry',
      EntryDetail: 'entry/:entryId',
      EditEntry: 'entry/:entryId/edit',
      Profile: 'profile',
    },
  },
};

function Navigation() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Home',
            }}
          />
          <Stack.Screen
            name="NewEntry"
            component={NewEntryScreen}
            options={{
              presentation: 'modal',
              title: 'New Entry',
            }}
          />
          <Stack.Screen
            name="EntryDetail"
            component={EntryDetailScreen}
            options={{
              title: 'Entry Details',
            }}
          />
          <Stack.Screen
            name="EditEntry"
            component={EditEntryScreen}
            options={{
              presentation: 'modal',
              title: 'Edit Entry',
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Profile',
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Login',
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              title: 'Register',
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
      <StatusBar style="auto" />
    </Provider>
  );
}
