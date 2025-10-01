# Guidance API Documentation

## Overview

The Guidance API combines the Turso database of Bhagavad Gita verses with Ollama AI to provide intelligent, context-aware spiritual guidance. The system searches for relevant verses based on user queries and uses them to generate personalized, empathetic responses.

## Endpoints

### 1. Search Verses

**GET** `/api/guidance/verses?query=keyword&limit=10`

Search the database for verses matching a keyword or phrase.

**Query Parameters:**
- `query` (required): Search term or keyword
- `limit` (optional): Maximum number of results (default: 10, max: 50)

**Example Request:**
```bash
curl "http://localhost:5001/api/guidance/verses?query=karma&limit=5"
```

**Example Response:**
```json
{
  "success": true,
  "query": "karma",
  "count": 5,
  "data": [
    {
      "id": 88,
      "chapter_id": 4,
      "verse_number": 48,
      "sanskrit_text": "yoga-sthaḥ kuru karmāṇi...",
      "transliteration": "yoga-sthaḥ kuru karmāṇi...",
      "word_meanings": "yoga-sthaḥ—steadfast in yoga...",
      "translation_english": "Be steadfast in yoga, O Arjuna...",
      "purport": "Kṛṣṇa tells Arjuna...",
      "chapter_number": 2,
      "chapter_title": "Contents of the Gītā Summarized"
    }
  ]
}
```

**Search Coverage:**
- Sanskrit text
- Transliteration
- English translation
- Purport (commentary)
- Word meanings

---

### 2. Get AI Guidance

**POST** `/api/guidance/ask`

Get AI-powered spiritual guidance based on relevant Bhagavad Gita verses.

**Request Body:**
```json
{
  "query": "How to deal with anxiety?",
  "maxVerses": 5
}
```

**Parameters:**
- `query` (required): User's question or topic
- `maxVerses` (optional): Maximum verses to retrieve (default: 5)

**Example Request:**
```bash
curl -X POST http://localhost:5001/api/guidance/ask \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How to deal with anxiety?",
    "maxVerses": 3
  }'
```

**Example Response:**
```json
{
  "success": true,
  "query": "How to deal with anxiety?",
  "guidance": "Dear seeker, I can sense the weight of anxiety bearing down upon you...",
  "verses_referenced": [
    {
      "reference": "2.22",
      "chapter_title": "Contents of the Gītā Summarized",
      "translation": "As a person puts on new garments..."
    }
  ],
  "verse_count": 3,
  "timestamp": "2025-10-01T16:57:28.599Z"
}
```

**How It Works:**
1. Extracts keywords from user query
2. Searches database for relevant verses
3. Constructs context-rich prompt with verses
4. Sends to Ollama AI with spiritual guidance system prompt
5. Returns personalized guidance with verse citations

---

### 3. Multi-turn Chat

**POST** `/api/guidance/chat`

Engage in multi-turn conversation with verse-based context.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "What is dharma?" },
    { "role": "assistant", "content": "Dharma is..." },
    { "role": "user", "content": "How do I practice it?" }
  ],
  "includeVerses": true
}
```

**Parameters:**
- `messages` (required): Array of conversation messages
- `includeVerses` (optional): Include relevant verses (default: true)

**Example Request:**
```bash
curl -X POST http://localhost:5001/api/guidance/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What is karma?"},
      {"role": "assistant", "content": "Karma is the law of cause and effect..."},
      {"role": "user", "content": "How does it affect my daily life?"}
    ]
  }'
```

**Example Response:**
```json
{
  "success": true,
  "response": "Karma affects your daily life in profound ways...",
  "verses_referenced": [
    {
      "reference": "3.5",
      "translation": "All men are forced to act helplessly..."
    }
  ],
  "timestamp": "2025-10-01T17:00:00.000Z"
}
```

---

### 4. Get Topics

**GET** `/api/guidance/topics`

Get suggested topics and common questions for guidance.

**Example Request:**
```bash
curl http://localhost:5001/api/guidance/topics
```

**Example Response:**
```json
{
  "success": true,
  "topics": [
    {
      "topic": "Dealing with Anxiety and Stress",
      "keywords": ["anxiety", "stress", "worry", "fear", "peace"],
      "sample_query": "How can I find peace when dealing with anxiety?"
    },
    {
      "topic": "Understanding Duty and Purpose",
      "keywords": ["dharma", "duty", "purpose", "responsibility"],
      "sample_query": "What is my dharma and how do I fulfill it?"
    }
  ],
  "total": 8
}
```

**Available Topics:**
1. Dealing with Anxiety and Stress
2. Understanding Duty and Purpose
3. Handling Loss and Grief
4. Overcoming Attachment
5. Finding Inner Strength
6. Karma and Action
7. Self-Realization
8. Devotion and Love

---

## System Prompt

The AI uses a specialized system prompt that ensures:
- Compassionate, empathetic responses
- Grounding in authentic Bhagavad Gita verses
- Citation of specific verses (chapter.verse format)
- Connection of ancient wisdom to modern situations
- Practical, actionable advice
- Non-judgmental guidance

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Query is required",
  "message": "Please provide a question or topic for spiritual guidance"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "No relevant verses found",
  "message": "Could not find verses related to your query. Try different keywords."
}
```

### 503 Service Unavailable
```json
{
  "success": false,
  "error": "AI service unavailable",
  "message": "Ollama service is not available. Please ensure Ollama is running."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to generate guidance",
  "message": "Error details..."
}
```

---

## Usage Examples

### Example 1: Simple Question
```bash
curl -X POST http://localhost:5001/api/guidance/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "How to overcome fear?"}'
```

### Example 2: Search Specific Topic
```bash
curl "http://localhost:5001/api/guidance/verses?query=detachment&limit=3"
```

### Example 3: Conversation
```bash
curl -X POST http://localhost:5001/api/guidance/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What is the path to peace?"}
    ]
  }'
```

### Example 4: Get Topic Suggestions
```bash
curl http://localhost:5001/api/guidance/topics
```

---

## Integration Tips

### Frontend Integration

```javascript
// Search verses
async function searchVerses(query) {
  const response = await fetch(
    `http://localhost:5001/api/guidance/verses?query=${encodeURIComponent(query)}`
  );
  return await response.json();
}

// Get guidance
async function getGuidance(query) {
  const response = await fetch('http://localhost:5001/api/guidance/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, maxVerses: 5 })
  });
  return await response.json();
}

// Multi-turn chat
async function chat(messages) {
  const response = await fetch('http://localhost:5001/api/guidance/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  return await response.json();
}
```

### Python Integration

```python
import requests

# Search verses
def search_verses(query, limit=10):
    response = requests.get(
        f'http://localhost:5001/api/guidance/verses',
        params={'query': query, 'limit': limit}
    )
    return response.json()

# Get guidance
def get_guidance(query, max_verses=5):
    response = requests.post(
        'http://localhost:5001/api/guidance/ask',
        json={'query': query, 'maxVerses': max_verses}
    )
    return response.json()
```

---

## Performance Considerations

1. **Verse Search**: Optimized with database indexes on chapter_id and verse_number
2. **Keyword Extraction**: Simple stop-word filtering (can be enhanced with NLP)
3. **AI Response Time**: Depends on Ollama model and hardware (typically 5-30 seconds)
4. **Caching**: Consider caching common queries for faster responses
5. **Rate Limiting**: Implement rate limiting for production use

---

## Requirements

- **Ollama**: Must be running with llama3.1:8b model
- **Turso Database**: Must contain Bhagavad Gita verses
- **Node.js**: v14 or higher
- **Dependencies**: axios, express, @libsql/client

---

## Testing

```bash
# Test verse search
curl "http://localhost:5001/api/guidance/verses?query=peace"

# Test AI guidance (requires Ollama)
curl -X POST http://localhost:5001/api/guidance/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "How to find inner peace?"}'

# Test topics
curl http://localhost:5001/api/guidance/topics
```

---

## Future Enhancements

1. **Advanced NLP**: Use better keyword extraction and semantic search
2. **Vector Search**: Implement embedding-based similarity search
3. **Caching**: Cache frequently asked questions
4. **Analytics**: Track popular queries and verse usage
5. **Multi-language**: Support queries in multiple languages
6. **Voice Input**: Accept audio queries
7. **Personalization**: Remember user preferences and conversation history

---

**API is ready!** Start asking questions and receiving wisdom from the Bhagavad Gita. 🙏
