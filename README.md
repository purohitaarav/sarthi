# Sarthi

A full-stack web application template with React frontend, Node/Express backend, SQLite database, **Turso (libSQL)** for Bhagavad Gita content, and **Ollama AI integration** for spiritual guidance.

## Features

- **React Frontend**: Modern React 18 with hooks, React Router, and Tailwind CSS
- **Express Backend**: RESTful API with Node.js and Express
- **SQLite Database**: Lightweight and efficient database integration
- **Turso (libSQL)**: Dedicated database for Bhagavad Gita chapters, verses, translations, and purports
- **Ollama AI Integration**: Spiritual guidance powered by Llama 3.1 8B with Bhagavad Gita teachings
- **Authentication Ready**: JWT and bcrypt setup for user authentication
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS and Lucide icons
- **Development Tools**: Hot reload with nodemon and concurrently

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- SQLite3
- Turso / libSQL
- Ollama (Llama 3.1 8B)
- Axios
- bcryptjs
- jsonwebtoken
- dotenv

## Project Structure

```
sarthi/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Express backend
│   ├── config/           # Configuration files
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── scripts/          # Utility scripts
│   ├── database/         # SQLite database
│   └── index.js
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```
   This will install dependencies for both backend and frontend.

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the values as needed.

4. **Set up the database**
   ```bash
   npm run setup-db
   ```
   This creates the SQLite database and tables with sample data.

5. **Set up Turso database (for Bhagavad Gita content)**
   ```bash
   npm run setup-turso
   ```
   This creates the Turso database with schema for chapters, verses, translations, and commentaries.
   See `TURSO_SETUP.md` for detailed instructions.

6. **Ingest Bhagavad Gita data (optional)**
   ```bash
   # Place HTML files (1.html to 18.html) in gita-data/ folder
   npm run ingest-gita
   ```
   This parses HTML files and populates the database with all 700 verses.
   See `DATA_INGESTION_GUIDE.md` for detailed instructions.

7. **Set up Ollama (for AI spiritual guidance)**
   ```bash
   # Install Ollama (macOS)
   brew install ollama
   
   # Start Ollama service
   ollama serve
   
   # Pull Llama 3.1 8B model (in a new terminal)
   ollama pull llama3.1:8b
   ```
   See `OLLAMA_SETUP.md` for detailed instructions.

### Running the Application

#### Development Mode (Recommended)
Run both frontend and backend concurrently:
```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

#### Production Mode
1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

The app will be available at http://localhost:5000

### Individual Commands

- **Backend only**: `npm run server`
- **Frontend only**: `npm run client`
- **Build frontend**: `npm run build`

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `GET /api/items/user/:userId` - Get items by user
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Spiritual Guidance (Ollama AI)
- `POST /api/spiritual/ask` - Ask for spiritual guidance
- `POST /api/spiritual/chat` - Multi-turn conversation
- `GET /api/spiritual/health` - Check Ollama service status
- `GET /api/spiritual/models` - List available models

### Bhagavad Gita (Turso Database)
- `GET /api/gita/chapters` - Get all chapters
- `GET /api/gita/chapters/:number` - Get specific chapter
- `GET /api/gita/chapters/:number/verses` - Get chapter with verses
- `GET /api/gita/chapters/:chapter/verses/:verse` - Get specific verse
- `GET /api/gita/verses` - Get all verses
- `GET /api/gita/search?q=query` - Search verses
- `GET /api/gita/random` - Get random verse (Verse of the Day)
- `GET /api/gita/stats` - Get statistics
- `POST /api/gita/chapters` - Create chapter
- `POST /api/gita/verses` - Create verse

### AI-Powered Guidance (Ollama + Turso)
- `GET /api/guidance/verses?query=keyword` - Search verses by keyword
- `POST /api/guidance/ask` - Get AI guidance with relevant verses
- `POST /api/guidance/chat` - Multi-turn conversation with verse context
- `GET /api/guidance/topics` - Get suggested topics and questions

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Items Table
```sql
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  user_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
DB_PATH=./server/database/sarthi.db

# Ollama Configuration
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Turso (libSQL) Configuration
TURSO_DATABASE_URL=file:./server/database/gita.db
# For production: TURSO_DATABASE_URL=libsql://your-database.turso.io
# TURSO_AUTH_TOKEN=your_auth_token_here
```

## Customization

### Adding New Routes

1. **Backend**: Create a new route file in `server/routes/`
2. **Frontend**: Add new pages in `client/src/pages/`
3. Update navigation in `client/src/components/Layout.jsx`

### Adding New Database Tables

1. Update `server/scripts/setupDatabase.js`
2. Create a new model in `server/models/`
3. Create corresponding routes in `server/routes/`

## Development Tips

- The frontend proxies API requests to the backend in development
- Hot reload is enabled for both frontend and backend
- Database file is created in `server/database/sarthi.db`
- Keep Ollama running for spiritual guidance features
- Check browser console and terminal for errors

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Build the frontend: `npm run build`
3. Start the server: `npm start`
4. Consider using PM2 or similar for process management

## License

ISC

## Contributing

Feel free to customize this template for your needs!
