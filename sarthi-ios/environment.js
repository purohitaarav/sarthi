// Environment configuration for Sarthi iOS app
// This file replaces dotenv for Expo Go compatibility

const environment = {
  // API Configuration
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001',
  EXPO_PUBLIC_API_TIMEOUT: process.env.EXPO_PUBLIC_API_TIMEOUT || '30000',
  
  // App Configuration
  EXPO_PUBLIC_APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'Sarthi',
  EXPO_PUBLIC_APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  
  // Development/Production flags
  EXPO_PUBLIC_DEV_MODE: process.env.EXPO_PUBLIC_DEV_MODE || 'true',
  EXPO_PUBLIC_DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE || 'false',
};

export default environment;
