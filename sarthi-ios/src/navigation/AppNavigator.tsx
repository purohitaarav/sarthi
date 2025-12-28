import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import ResponseScreen from '../screens/ResponseScreen';
import HistoryScreen from '../screens/HistoryScreen';
import GuidanceScreen from '../screens/GuidanceScreen';
import UsersScreen from '../screens/UsersScreen';
import ReflectionsScreen from '../screens/ReflectionsScreen';
import SpiritualScreen from '../screens/SpiritualScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0284c7',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Sarthi' }}
        />
        <Stack.Screen 
          name="Response" 
          component={ResponseScreen}
          options={{ title: 'Guidance Response' }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ title: 'Past Conversations' }}
        />
        <Stack.Screen 
          name="Guidance" 
          component={GuidanceScreen}
          options={{ title: 'AI Guidance' }}
        />
        <Stack.Screen 
          name="Users" 
          component={UsersScreen}
          options={{ title: 'Users' }}
        />
        <Stack.Screen 
          name="Reflections" 
          component={ReflectionsScreen}
          options={{ title: 'Reflections' }}
        />
        <Stack.Screen 
          name="Spiritual" 
          component={SpiritualScreen}
          options={{ title: 'Spiritual Guidance' }}
        />
        <Stack.Screen 
          name="About" 
          component={AboutScreen}
          options={{ title: 'About' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

