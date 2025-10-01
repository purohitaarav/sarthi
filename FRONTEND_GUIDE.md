# Spiritual Frontend Guide

## Overview

The Sarthi frontend is a beautiful, spiritual-themed React application that provides AI-powered guidance based on the Bhagavad Gita. It features serene colors (blue to gold gradients), lotus motifs, smooth animations, and a mobile-responsive design.

## Features

### 🎨 Spiritual Theme
- **Color Palette**: Blue to gold gradients representing divine wisdom
- **Animations**: Smooth fade-ins, slide-ups, and floating elements
- **Typography**: Clean sans-serif fonts (Inter, Poppins)
- **Sacred Symbols**: Om symbol, lotus motifs, mandala patterns

### 🧘 User Experience
- **Clean Interface**: Minimalist design focused on spiritual guidance
- **Sample Queries**: Quick-start questions to guide users
- **Loading States**: Beautiful loading animations during AI processing
- **Error Handling**: Helpful error messages with retry options
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### ⚡ Components

#### 1. GuidanceForm
**Location**: `client/src/components/GuidanceForm.jsx`

**Features**:
- Large textarea for user queries
- Sample question buttons for quick start
- Loading state with animated spinner
- Gradient submit button with hover effects
- Disabled state during processing

**Props**:
- `onSubmit(query)` - Callback when form is submitted
- `isLoading` - Boolean to show loading state

#### 2. ResponseDisplay
**Location**: `client/src/components/ResponseDisplay.jsx`

**Features**:
- Displays user's original question
- Shows AI-generated guidance
- Lists referenced Bhagavad Gita verses in cards
- Verse count badge
- Timestamp of response

**Props**:
- `response` - Response object from API containing:
  - `query` - User's question
  - `guidance` - AI response
  - `verses_referenced` - Array of verse objects
  - `timestamp` - Response timestamp

#### 3. SpiritualHome
**Location**: `client/src/pages/SpiritualHome.jsx`

**Features**:
- Main page integrating form and response
- API integration with error handling
- Loading states
- Auto-scroll to response
- Background pattern overlay
- Floating Om symbol

## Theme Configuration

### Tailwind Config
**Location**: `client/tailwind.config.js`

**Custom Colors**:
```javascript
spiritual: {
  blue: { light, DEFAULT, dark },
  gold: { light, DEFAULT, dark },
  lotus: { pink, purple },
  sacred: { saffron, cream }
}
```

**Gradients**:
- `bg-gradient-spiritual` - Blue to gold (135deg)
- `bg-gradient-serene` - Light blue to cream (vertical)
- `bg-gradient-divine` - Blue to gold to pink (135deg)

**Animations**:
- `animate-fade-in` - Fade in (0.5s)
- `animate-slide-up` - Slide up from bottom (0.5s)
- `animate-pulse-slow` - Slow pulse (3s)
- `animate-float` - Floating motion (6s)

## API Integration

### Endpoint Used
```javascript
POST /api/guidance/ask
```

### Request Format
```javascript
{
  query: "How can I find inner peace?",
  maxVerses: 5
}
```

### Response Format
```javascript
{
  success: true,
  query: "How can I find inner peace?",
  guidance: "Dear seeker...",
  verses_referenced: [
    {
      reference: "2.47",
      chapter_title: "Contents of the Gītā Summarized",
      translation: "You have a right to perform..."
    }
  ],
  verse_count: 3,
  timestamp: "2025-10-01T17:00:00.000Z"
}
```

## Routes

### Main Routes
- `/` - Home page (with layout)
- `/guidance` - **AI Guidance page** (full-page, no layout)
- `/users` - Users management
- `/items` - Items management
- `/spiritual` - Original spiritual guidance
- `/about` - About page

## Setup & Installation

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Configure Proxy
Already configured in `package.json`:
```json
"proxy": "http://localhost:5001"
```

### 3. Start Development Server
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Usage Flow

### 1. User Visits `/guidance`
- Beautiful landing page with gradient background
- Centered form with sample questions
- Om symbol floating in corner

### 2. User Enters Question
- Types in textarea or clicks sample question
- Clicks "Seek Guidance" button
- Button shows loading state

### 3. Loading State
- Form disabled
- Loading animation appears
- Message: "Consulting the wisdom of the Bhagavad Gita..."

### 4. Response Displayed
- Original question shown in card
- AI guidance displayed with formatting
- Referenced verses shown in individual cards
- Auto-scroll to response
- Verse count badge

### 5. Error Handling
- Network errors caught and displayed
- Ollama unavailable message
- No verses found message
- Retry button provided

## Styling Guide

### Color Usage

**Primary Actions**:
```jsx
className="bg-gradient-spiritual text-white"
```

**Backgrounds**:
```jsx
className="bg-gradient-serene"
```

**Cards**:
```jsx
className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100"
```

**Verse Cards**:
```jsx
className="bg-white rounded-lg p-5 shadow-md border-l-4 border-spiritual-gold"
```

### Animation Usage

**Fade In**:
```jsx
className="animate-fade-in"
```

**Slide Up**:
```jsx
className="animate-slide-up"
```

**Floating**:
```jsx
className="animate-float"
```

**Pulsing**:
```jsx
className="animate-pulse-slow"
```

## Mobile Responsiveness

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Responsive Classes
```jsx
className="text-4xl md:text-5xl"  // Larger text on desktop
className="p-6 md:p-8"             // More padding on desktop
className="grid gap-4"             // Responsive grid
```

## Sample Queries

Pre-defined questions to help users:
1. "How can I find inner peace?"
2. "What is my dharma?"
3. "How to deal with anxiety?"
4. "How to overcome fear?"
5. "What does the Gita say about karma?"

## Error States

### Ollama Unavailable (503)
```
AI service is currently unavailable. 
Please ensure Ollama is running.
```

### No Verses Found (404)
```
No relevant verses found for your query. 
Try different keywords.
```

### Network Error
```
Failed to connect to the server. 
Please try again.
```

## Performance Optimizations

### 1. Lazy Loading
Components load on demand

### 2. Optimized Images
Background patterns use SVG data URIs

### 3. Smooth Animations
CSS animations with hardware acceleration

### 4. Auto-scroll
Smooth scroll to response after loading

## Customization

### Change Theme Colors
Edit `client/tailwind.config.js`:
```javascript
spiritual: {
  blue: { DEFAULT: '#your-color' },
  gold: { DEFAULT: '#your-color' }
}
```

### Add New Sample Questions
Edit `client/src/components/GuidanceForm.jsx`:
```javascript
const sampleQueries = [
  "Your new question here",
  // ... more questions
];
```

### Modify Loading Message
Edit `client/src/pages/SpiritualHome.jsx`:
```javascript
<p className="text-lg text-gray-600 animate-pulse">
  Your custom loading message...
</p>
```

## Testing

### Manual Testing
```bash
# 1. Start backend
PORT=5001 node server/index.js

# 2. Start frontend (in another terminal)
cd client
npm start

# 3. Visit http://localhost:3000/guidance

# 4. Test scenarios:
- Enter a question
- Click sample questions
- Test with Ollama stopped (error handling)
- Test on mobile (responsive design)
- Test loading states
```

### Test Checklist
- [ ] Form submission works
- [ ] Sample questions populate textarea
- [ ] Loading state appears
- [ ] Response displays correctly
- [ ] Verses show in cards
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] Animations smooth
- [ ] Auto-scroll works
- [ ] Retry button functions

## Deployment

### Build for Production
```bash
cd client
npm run build
```

### Environment Variables
No frontend env variables needed (uses proxy)

### Serve Static Files
Backend serves built files in production:
```javascript
// In server/index.js
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
```

## Troubleshooting

### Issue: Proxy not working
**Solution**: Ensure backend is running on port 5001

### Issue: Styles not applying
**Solution**: Run `npm run build` to rebuild Tailwind

### Issue: Components not found
**Solution**: Check import paths are correct

### Issue: API errors
**Solution**: Check backend is running and Ollama is available

## Future Enhancements

1. **Voice Input**: Add speech-to-text for queries
2. **History**: Save previous queries and responses
3. **Favorites**: Bookmark favorite verses
4. **Share**: Share guidance on social media
5. **Dark Mode**: Add dark theme toggle
6. **Translations**: Multi-language support
7. **Audio**: Sanskrit verse pronunciation
8. **Animations**: More elaborate entrance animations

---

**Your spiritual frontend is ready!** Visit `/guidance` to experience divine wisdom. 🙏✨
