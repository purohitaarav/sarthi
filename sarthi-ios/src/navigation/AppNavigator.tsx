import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { colors } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import GuidanceScreen from '../screens/GuidanceScreen';
import AboutScreen from '../screens/AboutScreen';
import ResponseScreen from '../screens/ResponseScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: colors.primary[600],
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerShadowVisible: true,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Sarthi' }}
        />
        <Stack.Screen
          name="Guidance"
          component={GuidanceScreen}
          options={{ title: 'AI Guidance' }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: 'About Sarthi' }}
        />
        <Stack.Screen
          name="Response"
          component={ResponseScreen}
          options={{ title: 'Guidance Response' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
