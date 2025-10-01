# Turso (libSQL) Integration - Bhagavad Gita Database

This guide explains how to set up and use Turso (libSQL) for storing Bhagavad Gita content in your Sarthi application.

## What is Turso?

Turso is a distributed database built on libSQL (SQLite fork) that offers:
- **Local-first development** - Works with local SQLite files
- **Edge deployment** - Deploy globally with low latency
- **SQLite compatibility** - Use familiar SQLite syntax
- **Scalability** - Seamlessly scale from local to cloud

## Database Schema

### Tables

#### 1. **chapters**
Stores Bhagavad Gita chapter information.

```sql
CREATE TABLE chapters (
  id INTEGER PRIMARY KEY,
  chapter_number INTEGER UNIQUE NOT NULL,
  title_sanskrit TEXT NOT NULL,
  title_english TEXT NOT NULL,
  title_transliteration TEXT,
  summary TEXT,
  verse_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### 2. **verses**
Stores individual verses with Sanskrit text, translations, and purports.

```sql
CREATE TABLE verses (
  id INTEGER PRIMARY KEY,
  chapter_id INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  sanskrit_text TEXT NOT NULL,
  transliteration TEXT,
  word_meanings TEXT,
  translation_english TEXT NOT NULL,
  purport TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  UNIQUE(chapter_id, verse_number)
)
```

#### 3. **translations**
Supports multiple language translations for verses.

```sql
CREATE TABLE translations (
  id INTEGER PRIMARY KEY,
  verse_id INTEGER NOT NULL,
  language_code TEXT NOT NULL,
  translation TEXT NOT NULL,
  translator TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE,
  UNIQUE(verse_id, language_code)
)
```

#### 4. **commentaries**
Stores commentaries from different scholars/commentators.

```sql
CREATE TABLE commentaries (
  id INTEGER PRIMARY KEY,
  verse_id INTEGER NOT NULL,
  commentator TEXT NOT NULL,
  commentary TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE
)
```

## Setup Instructions

### Option 1: Local Development (File-based)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   The default configuration uses a local file:
   ```env
   TURSO_DATABASE_URL=file:./server/database/gita.db
   ```

3. **Initialize the database**
   ```bash
   npm run setup-turso
   ```
   
   This will:
   - Create the database file
   - Set up all tables
   - Insert sample data (2 chapters, 2 verses)

4. **Start the server**
   ```bash
   npm run dev
   ```

### Option 2: Turso Cloud (Production)

1. **Install Turso CLI**
   ```bash
   # macOS/Linux
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Or with Homebrew
   brew install tursodatabase/tap/turso
   ```

2. **Sign up and authenticate**
   ```bash
   turso auth signup
   turso auth login
   ```

3. **Create a database**
   ```bash
   turso db create sarthi-gita
   ```

4. **Get database URL and token**
   ```bash
   turso db show sarthi-gita --url
   turso db tokens create sarthi-gita
   ```

5. **Update .env file**
   ```env
   TURSO_DATABASE_URL=libsql://sarthi-gita-[your-org].turso.io
   TURSO_AUTH_TOKEN=your_auth_token_here
   ```

6. **Initialize the database**
   ```bash
   npm run setup-turso
   ```

## API Endpoints

### Chapters

```bash
# Get all chapters
GET /api/gita/chapters

# Get specific chapter
GET /api/gita/chapters/:number

# Get chapter with all verses
GET /api/gita/chapters/:number/verses

# Create chapter
POST /api/gita/chapters

# Update chapter
PUT /api/gita/chapters/:id

# Delete chapter
DELETE /api/gita/chapters/:id
```

### Verses

```bash
# Get all verses
GET /api/gita/verses

# Get specific verse by ID
GET /api/gita/verses/:id

# Get specific verse by chapter and verse number
GET /api/gita/chapters/:chapter/verses/:verse

# Create verse
POST /api/gita/verses

# Update verse
PUT /api/gita/verses/:id

# Delete verse
DELETE /api/gita/verses/:id
```

### Special Endpoints

```bash
# Search verses
GET /api/gita/search?q=dharma

# Get random verse (Verse of the Day)
GET /api/gita/random

# Get statistics
GET /api/gita/stats
```

## Usage Examples

### Get All Chapters
```bash
curl http://localhost:5000/api/gita/chapters
```

Response:
```json
{
  "success": true,
  "count": 18,
  "data": [
    {
      "id": 1,
      "chapter_number": 1,
      "title_sanskrit": "अर्जुनविषादयोग",
      "title_english": "Arjuna Vishada Yoga",
      "verse_count": 47
    }
  ]
}
```

### Get Specific Verse
```bash
curl http://localhost:5000/api/gita/chapters/2/verses/47
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "chapter_number": 2,
    "verse_number": 47,
    "sanskrit_text": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन...",
    "translation_english": "You have a right to perform your prescribed duties...",
    "purport": "This is one of the most famous verses..."
  }
}
```

### Search Verses
```bash
curl "http://localhost:5000/api/gita/search?q=karma"
```

### Create a New Verse
```bash
curl -X POST http://localhost:5000/api/gita/verses \
  -H "Content-Type: application/json" \
  -d '{
    "chapter_id": 1,
    "verse_number": 2,
    "sanskrit_text": "सञ्जय उवाच...",
    "translation_english": "Sanjaya said...",
    "purport": "This verse describes..."
  }'
```

## Models

### Chapter Model
Located in `server/models/Chapter.js`

Methods:
- `getAll()` - Get all chapters
- `getById(id)` - Get chapter by ID
- `getByChapterNumber(number)` - Get chapter by number
- `getWithVerses(number)` - Get chapter with all verses
- `create(data)` - Create new chapter
- `update(id, data)` - Update chapter
- `delete(id)` - Delete chapter
- `getStats()` - Get statistics

### Verse Model
Located in `server/models/Verse.js`

Methods:
- `getAll()` - Get all verses
- `getById(id)` - Get verse by ID
- `getByChapterId(chapterId)` - Get verses by chapter
- `getByChapterAndVerse(chapter, verse)` - Get specific verse
- `create(data)` - Create new verse
- `update(id, data)` - Update verse
- `delete(id)` - Delete verse
- `search(term)` - Search verses
- `getRandom()` - Get random verse
- `getCountByChapter(chapterId)` - Count verses in chapter

## Data Population

### Manual Data Entry
Use the API endpoints to add chapters and verses programmatically.

### Bulk Import
Create a migration script in `server/scripts/migrateTurso.js` to import data from:
- JSON files
- CSV files
- External APIs (like Vedabase.io)

Example structure for JSON import:
```json
{
  "chapters": [
    {
      "chapter_number": 1,
      "title_sanskrit": "अर्जुनविषादयोग",
      "title_english": "Arjuna Vishada Yoga",
      "verses": [
        {
          "verse_number": 1,
          "sanskrit_text": "...",
          "translation_english": "...",
          "purport": "..."
        }
      ]
    }
  ]
}
```

## Integration with Spiritual Guidance

The Turso database can be integrated with your Ollama-powered spiritual guidance:

1. **Context-aware responses** - Fetch relevant verses based on user questions
2. **Verse references** - Include specific Gita verses in AI responses
3. **Enhanced prompts** - Use verse content to enrich the system prompt

Example integration in `spiritualRoutes.js`:
```javascript
const Verse = require('../models/Verse');

// Search for relevant verses
const verses = await Verse.search(question);

// Include in prompt
const context = verses.map(v => 
  `${v.chapter_number}.${v.verse_number}: ${v.translation_english}`
).join('\n');
```

## Performance Tips

1. **Indexes** - Already created on frequently queried columns
2. **Batch operations** - Use transactions for multiple inserts
3. **Caching** - Consider caching frequently accessed chapters
4. **Pagination** - Implement pagination for large result sets

## Backup and Restore

### Local Database
```bash
# Backup
cp server/database/gita.db server/database/gita.db.backup

# Restore
cp server/database/gita.db.backup server/database/gita.db
```

### Turso Cloud
Turso automatically handles backups and replication.

## Troubleshooting

### Database file not found
- Run `npm run setup-turso` to create the database
- Check that `server/database/` directory exists

### Connection errors
- Verify `TURSO_DATABASE_URL` in `.env`
- For cloud: Check auth token is valid

### Query errors
- Check SQL syntax (libSQL uses SQLite syntax)
- Verify foreign key constraints
- Check data types match schema

## Resources

- [Turso Documentation](https://docs.turso.tech/)
- [libSQL GitHub](https://github.com/tursodatabase/libsql)
- [@libsql/client NPM](https://www.npmjs.com/package/@libsql/client)
- [Bhagavad Gita Online](https://www.holy-bhagavad-gita.org/)

## Next Steps

1. **Populate full Gita** - Add all 18 chapters and 700 verses
2. **Add translations** - Support multiple languages
3. **Add commentaries** - Include different interpretations
4. **Build frontend** - Create UI to browse and search verses
5. **Integrate with AI** - Use verses in spiritual guidance responses

---

**Database ready!** Start adding Bhagavad Gita content to your Sarthi application.
