# Sarthi iOS App

React Native iOS app for Sarthi, built with Expo and TypeScript.

## Project Structure

```
sarthi-ios/
├── src/
│   ├── screens/           # Main screens (Home, Guidance, Users, etc.)
│   ├── components/        # Reusable components
│   ├── services/          # API calls (points to existing Render API)
│   ├── navigation/        # React Navigation setup
│   ├── types/            # TypeScript types
│   └── theme/            # Colors, fonts, spacing
├── app.json
└── package.json
```

## API Configuration

The app points to the existing Render API:
- Base URL: `https://sarthiai.onrender.com`
- All API calls go through `/api` endpoints

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on iOS:
   ```bash
   npm run ios
   ```

## Features

- ✅ Navigation between screens
- ✅ AI Guidance screen with API integration
- ✅ Points to existing Render backend
- ✅ TypeScript support
- ✅ Theme system matching web version

## Next Steps

- Implement Users screen functionality
- Implement Reflections screen functionality
- Implement Spiritual screen functionality
- Add secure storage for authentication tokens
- Add error handling and loading states

