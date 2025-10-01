# Sarthi - Complete Setup & Usage Guide

## 🙏 Overview

**Sarthi** is a full-stack spiritual guidance application that combines:
- **Bhagavad Gita Database** (653 verses in Turso/libSQL)
- **AI-Powered Guidance** (Ollama with Llama 3.1 8B)
- **Beautiful Spiritual UI** (React with Tailwind CSS)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install all dependencies
npm run install-deps

# Or manually:
npm install
cd client && npm install
```

### 2. Set Up Databases
```bash
# Set up SQLite database
npm run setup-db

# Set up Turso database for Bhagavad Gita
npm run setup-turso
```

### 3. Install & Start Ollama
```bash
# Install Ollama (macOS)
brew install ollama

# Start Ollama service (keep this running)
ollama serve

# In another terminal, pull the model
ollama pull llama3.1:8b
```

### 4. Ingest Bhagavad Gita Data
```bash
# If you have HTML files in gita-data/ folder
npm run ingest-gita

# This will populate the database with all verses
```

### 5. Start the Application
```bash
# Start backend (port 5001)
PORT=5001 node server/index.js

# In another terminal, start frontend (port 3000)
cd client && npm start
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **AI Guidance**: http://localhost:3000/guidance
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/api/health

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  - Spiritual-themed UI (Blue/Gold gradients)            │
│  - GuidanceForm component                               │
│  - ResponseDisplay component                            │
│  - Mobile responsive with Tailwind CSS                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  Express Backend (Port 5001)            │
│  - CORS enabled                                         │
│  - Error handling                                       │
│  - Request logging                                      │
└─────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────┴──────────────────┐
        ↓                                      ↓
┌──────────────────┐              ┌──────────────────────┐
│  Turso Database  │              │   Ollama AI Service  │
│  - 18 Chapters   │              │   - Llama 3.1 8B     │
│  - 653 Verses    │              │   - Port 11434       │
│  - Translations  │              │   - Local inference  │
│  - Purports      │              │                      │
└──────────────────┘              └──────────────────────┘
```

## 🎯 Key Features

### Backend Features
1. **Turso Database Integration**
   - 18 chapters of Bhagavad Gita
   - 653 verses with Sanskrit, translations, and purports
   - Fast search and retrieval

2. **AI-Powered Guidance**
   - Automatic verse retrieval based on keywords
   - Context-aware AI responses
   - Verse citations in responses
   - Empathetic, spiritual guidance

3. **Robust API**
   - RESTful endpoints
   - Error handling
   - Request logging
   - CORS configured

### Frontend Features
1. **Spiritual Theme**
   - Blue to gold gradients
   - Smooth animations
   - Om symbol and sacred motifs
   - Mobile responsive

2. **User Experience**
   - Sample questions for quick start
   - Loading states with animations
   - Error handling with retry
   - Auto-scroll to responses

3. **Response Display**
   - Formatted guidance text
   - Verse cards with references
   - Chapter titles
   - Timestamps

## 📡 API Endpoints

### Guidance Endpoints
```bash
# Search verses by keyword
GET /api/guidance/verses?query=peace&limit=10

# Get AI guidance with verses
POST /api/guidance/ask
Body: { "query": "How to find inner peace?", "maxVerses": 5 }

# Multi-turn chat
POST /api/guidance/chat
Body: { "messages": [...] }

# Get suggested topics
GET /api/guidance/topics
```

### Gita Endpoints
```bash
# Get all chapters
GET /api/gita/chapters

# Get specific chapter with verses
GET /api/gita/chapters/2/verses

# Get specific verse
GET /api/gita/chapters/2/verses/47

# Search verses
GET /api/gita/search?q=karma

# Random verse (Verse of the Day)
GET /api/gita/random

# Statistics
GET /api/gita/stats
```

## 🎨 Frontend Routes

- `/` - Home page
- `/guidance` - **AI Guidance** (main feature)
- `/users` - User management
- `/items` - Item management
- `/spiritual` - Original spiritual guidance
- `/about` - About page

## 💡 Usage Example

### 1. Visit AI Guidance Page
Navigate to: http://localhost:3000/guidance

### 2. Enter a Question
Type or click a sample question:
- "How can I find inner peace?"
- "What is my dharma?"
- "How to deal with anxiety?"

### 3. Receive Guidance
The system will:
1. Extract keywords from your question
2. Search database for relevant verses (3-5 verses)
3. Send verses + question to Ollama AI
4. Return personalized guidance with verse citations

### 4. View Response
- See your original question
- Read AI-generated guidance
- View referenced verses in cards
- Each verse shows chapter, verse number, and translation

## 🔧 Configuration

### Environment Variables (.env)
```env
# Server
PORT=5001
NODE_ENV=development

# Database
DB_PATH=./server/database/sarthi.db

# Turso
TURSO_DATABASE_URL=file:./server/database/gita.db

# Ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# CORS (Production)
# ALLOWED_ORIGINS=https://yourdomain.com
```

### Tailwind Theme
Custom spiritual colors in `client/tailwind.config.js`:
- `spiritual-blue` - Divine blue
- `spiritual-gold` - Sacred gold
- `lotus-pink` - Lotus pink
- `sacred-saffron` - Saffron orange

## 📝 Sample Queries

Pre-loaded sample questions:
1. How can I find inner peace?
2. What is my dharma?
3. How to deal with anxiety?
4. How to overcome fear?
5. What does the Gita say about karma?

## 🧪 Testing

### Test Backend
```bash
# Health check
curl http://localhost:5001/api/health

# Search verses
curl "http://localhost:5001/api/guidance/verses?query=peace"

# Get guidance (requires Ollama)
curl -X POST http://localhost:5001/api/guidance/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "How to find inner peace?"}'
```

### Test Frontend
1. Visit http://localhost:3000/guidance
2. Enter a question
3. Verify loading state appears
4. Check response displays correctly
5. Verify verses show in cards
6. Test on mobile (responsive design)

## 📚 Documentation Files

- `README.md` - Main documentation
- `QUICKSTART.md` - Quick start guide
- `OLLAMA_SETUP.md` - Ollama installation and setup
- `TURSO_SETUP.md` - Turso database setup
- `DATA_INGESTION_GUIDE.md` - How to ingest Gita data
- `GUIDANCE_API.md` - API reference
- `FRONTEND_GUIDE.md` - Frontend development guide
- `ERROR_HANDLING.md` - Error handling documentation
- `COMPLETE_SETUP_GUIDE.md` - This file

## 🐛 Troubleshooting

### Backend Won't Start
**Issue**: Port 5001 already in use
**Solution**: 
```bash
lsof -ti:5001 | xargs kill -9
PORT=5001 node server/index.js
```

### Ollama Unavailable
**Issue**: "AI service unavailable" error
**Solution**:
```bash
# Start Ollama
ollama serve

# Verify it's running
curl http://localhost:11434/api/tags
```

### No Verses Found
**Issue**: "No relevant verses found"
**Solution**:
- Ensure database is populated: `npm run setup-turso`
- Try different keywords
- Check database has data: `curl http://localhost:5001/api/gita/stats`

### Frontend Not Loading
**Issue**: Blank page or errors
**Solution**:
```bash
cd client
npm install
npm start
```

### Proxy Errors
**Issue**: API calls fail from frontend
**Solution**:
- Check `client/package.json` has `"proxy": "http://localhost:5001"`
- Ensure backend is running on port 5001
- Restart frontend after changing proxy

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Set environment
export NODE_ENV=production
export PORT=5001

# Start server (serves built frontend)
node server/index.js
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure `ALLOWED_ORIGINS` for CORS
3. Use Turso cloud database (optional)
4. Set up process manager (PM2)
5. Configure reverse proxy (Nginx)

## 📊 Database Statistics

After ingestion:
- **Chapters**: 18
- **Verses**: 653
- **Database Size**: ~5MB
- **Search Performance**: < 100ms

## 🎯 Next Steps

### Immediate
1. ✅ Test all features
2. ✅ Verify Ollama integration
3. ✅ Check mobile responsiveness

### Future Enhancements
1. **User Accounts**: Save favorite verses and queries
2. **History**: Track previous guidance sessions
3. **Voice Input**: Speech-to-text for queries
4. **Sharing**: Share guidance on social media
5. **Dark Mode**: Toggle between light/dark themes
6. **Multi-language**: Support other languages
7. **Audio**: Sanskrit pronunciation
8. **Advanced Search**: Semantic search with embeddings

## 🙏 Credits

- **Bhagavad Gita**: Ancient Vedic scripture
- **Ollama**: Local AI inference
- **Turso**: libSQL database
- **React**: Frontend framework
- **Tailwind CSS**: Styling
- **Express**: Backend framework

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review error messages
3. Check backend logs
4. Verify all services are running

---

**Your spiritual guidance application is ready!** 🌟

Visit http://localhost:3000/guidance to begin your journey. 🙏✨
