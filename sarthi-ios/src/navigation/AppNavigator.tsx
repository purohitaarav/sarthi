import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { DrawerProvider } from '../context/DrawerContext';
import CustomDrawer from '../components/CustomDrawer';
import CustomHeader from '../components/CustomHeader';

import HomeScreen from '../screens/HomeScreen';
import ResponseScreen from '../screens/ResponseScreen';
import ReflectionsScreen from '../screens/ReflectionsScreen';
import AboutScreen from '../screens/AboutScreen';
import HistoryScreen from '../screens/HistoryScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

// Home stack
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: () => <CustomHeader title="Ask Guidance" />,
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <DrawerProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: '#1C1917', // Neutral Gray 900
            headerTitleStyle: { fontWeight: 'bold' },
            animation: 'fade', // Subtle fade instead of slide for drawer-like feel
          }}
        >
          <Stack.Screen
            name="HomeMain"
            component={HomeStack}
            options={{
              headerShown: false, // HomeStack has its own header
            }}
          />
          <Stack.Screen
            name="Reflections"
            component={ReflectionsScreen}
            options={{
              header: () => <CustomHeader title="My Reflections" />,
            }}
          />
          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{
              header: () => <CustomHeader title="History" />,
            }}
          />
          <Stack.Screen
            name="Response"
            component={ResponseScreen}
            options={{
              presentation: 'modal',
              title: 'Spiritual Guidance',
              headerStyle: { backgroundColor: '#fff' },
              headerTintColor: '#1C1917',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{
              header: () => <CustomHeader title="About Sarthi" />,
            }}
          />
        </Stack.Navigator>
        <CustomDrawer />
      </NavigationContainer>
    </DrawerProvider>
  );
}
