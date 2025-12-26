# Sarthi

A full-stack web application template with React frontend, Node/Express backend, SQLite database, **Turso (libSQL)** for Bhagavad Gita content, and **Gemini AI integration** for spiritual guidance.

## Features

- **React Frontend**: Modern React 18 with hooks, React Router, and Tailwind CSS
- **Express Backend**: RESTful API with Node.js and Express
- **SQLite Database**: Lightweight and efficient database integration
- **Turso (libSQL)**: Dedicated database for Bhagavad Gita chapters, verses, translations, and purports
- **Gemini AI Integration**: Spiritual guidance powered by Google's Gemini 2.5 models
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
- Google Generative AI (Gemini 2.5 Pro & Flash)
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
   Edit `.env` and add your Gemini API Key.

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

7. **Embed Verses for Semantic Search**
   ```bash
   # Generates embeddings using Gemini's text-embedding-004 model
   node server/scripts/backfill-embeddings.js
   ```

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

### Spiritual Guidance (Gemini AI)
- `POST /api/spiritual/ask` - Ask for spiritual guidance
- `POST /api/spiritual/chat` - Multi-turn conversation
- `GET /api/spiritual/health` - Check Gemini service status
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

### AI-Powered Guidance (Gemini + Turso)
- `GET /api/guidance/verses?query=keyword` - Search verses by keyword
- `POST /api/guidance/ask` - Get AI guidance with relevant verses
- `POST /api/guidance/chat` - Multi-turn conversation with verse context
- `GET /api/guidance/topics` - Get suggested topics and questions

### Health Check
- `GET /api/health` - Server health status

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
DB_PATH=./server/database/sarthi.db

# Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Turso (libSQL) Configuration
TURSO_DATABASE_URL=file:./server/database/gita.db
# For production: TURSO_DATABASE_URL=libsql://your-database.turso.io
# TURSO_AUTH_TOKEN=your_auth_token_here
```

## License

ISC
