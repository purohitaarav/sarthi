# Sarthi - Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Install everything
npm run install-deps

# Setup database
npm run setup-db

# Install & start Ollama (macOS)
brew install ollama
ollama serve                    # Keep this running
ollama pull llama3.1:8b        # In another terminal

# Start development
npm run dev
```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Spiritual Guidance**: http://localhost:3000/spiritual
- **Ollama API**: http://localhost:11434

## 📡 API Endpoints

### Spiritual Guidance
```bash
POST   /api/spiritual/ask      # Ask a question
POST   /api/spiritual/chat     # Multi-turn conversation
GET    /api/spiritual/health   # Check Ollama status
GET    /api/spiritual/models   # List models
```

### Users
```bash
GET    /api/users              # Get all users
GET    /api/users/:id          # Get user by ID
POST   /api/users              # Create user
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user
```

### Items
```bash
GET    /api/items              # Get all items
GET    /api/items/:id          # Get item by ID
POST   /api/items              # Create item
PUT    /api/items/:id          # Update item
DELETE /api/items/:id          # Delete item
```

## 🔧 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_here
DB_PATH=./server/database/sarthi.db

# Ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

## 📁 Key Files

### Backend
- `server/index.js` - Main server
- `server/services/ollamaService.js` - Ollama integration
- `server/routes/spiritualRoutes.js` - Spiritual guidance API
- `server/routes/userRoutes.js` - User management
- `server/routes/itemRoutes.js` - Item management
- `server/models/User.js` - User model
- `server/models/Item.js` - Item model
- `server/config/database.js` - SQLite connection

### Frontend
- `client/src/App.js` - Main app & routing
- `client/src/pages/SpiritualGuidance.jsx` - AI guidance UI
- `client/src/pages/Home.jsx` - Dashboard
- `client/src/pages/Users.jsx` - User management
- `client/src/pages/Items.jsx` - Item management
- `client/src/components/Layout.jsx` - Navigation
- `client/src/services/api.js` - API client

## 🛠️ NPM Scripts

```bash
npm start              # Production server
npm run dev            # Dev mode (frontend + backend)
npm run server         # Backend only
npm run client         # Frontend only
npm run build          # Build frontend
npm run install-deps   # Install all dependencies
npm run setup-db       # Initialize database
```

## 🧪 Test Commands

```bash
# Check server health
curl http://localhost:5000/api/health

# Check Ollama health
curl http://localhost:5000/api/spiritual/health

# Ask spiritual question
curl -X POST http://localhost:5000/api/spiritual/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is dharma?"}'

# Get all users
curl http://localhost:5000/api/users

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

## 🎯 Common Tasks

### Add a New Page
1. Create `client/src/pages/NewPage.jsx`
2. Add route in `client/src/App.js`
3. Add nav item in `client/src/components/Layout.jsx`

### Add a New API Endpoint
1. Create `server/routes/newRoutes.js`
2. Import in `server/index.js`
3. Add `app.use('/api/new', newRoutes)`

### Change Ollama Model
1. Edit `.env`: `OLLAMA_MODEL=llama3.1:3b`
2. Pull model: `ollama pull llama3.1:3b`
3. Restart server

### Customize Spiritual Prompt
Edit `server/routes/spiritualRoutes.js`:
- Find `BHAGAVAD_GITA_SYSTEM_PROMPT`
- Modify the prompt text

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Change `PORT` in `.env` |
| Ollama unavailable | Run `ollama serve` |
| Model not found | Run `ollama pull llama3.1:8b` |
| Database error | Run `npm run setup-db` |
| Module not found | Run `npm run install-deps` |
| Frontend won't start | `cd client && npm install` |
| Backend won't start | Check `.env` file exists |

## 📦 Tech Stack

**Frontend**: React 18, React Router, Tailwind CSS, Axios, Lucide Icons  
**Backend**: Node.js, Express, SQLite3, Ollama, Axios  
**AI**: Llama 3.1 8B via Ollama  
**Database**: SQLite  

## 📚 Documentation Files

- `README.md` - Full documentation
- `QUICKSTART.md` - Getting started guide
- `OLLAMA_SETUP.md` - Ollama setup instructions
- `INTEGRATION_SUMMARY.md` - Integration details
- `QUICK_REFERENCE.md` - This file

## 🎨 UI Pages

- **/** - Home/Dashboard
- **/users** - User management
- **/items** - Item management
- **/spiritual** - AI spiritual guidance ⭐
- **/about** - About page

## 🔑 Key Features

✅ Full-stack CRUD operations  
✅ RESTful API  
✅ SQLite database  
✅ AI spiritual guidance with Llama 3.1  
✅ Bhagavad Gita-based system prompt  
✅ Modern React UI  
✅ Tailwind CSS styling  
✅ Hot reload development  
✅ Health monitoring  
✅ Conversation history  

---

**Need help?** Check the full documentation in `README.md` or `OLLAMA_SETUP.md`
