# Ollama Integration - Spiritual Guidance Setup

This guide will help you set up Ollama with Llama 3.1 8B for spiritual guidance based on the Bhagavad Gita.

## Prerequisites

1. **Install Ollama**
   - Visit [ollama.ai](https://ollama.ai) and download Ollama for your system
   - Or use Homebrew on macOS: `brew install ollama`

2. **Start Ollama Service**
   ```bash
   ollama serve
   ```
   This starts the Ollama API server on `http://localhost:11434`

3. **Pull Llama 3.1 8B Model**
   ```bash
   ollama pull llama3.1:8b
   ```
   This downloads the Llama 3.1 8B model (approximately 4.7GB)

## Configuration

1. **Environment Variables**
   
   Copy `.env.example` to `.env` if you haven't already:
   ```bash
   cp .env.example .env
   ```

   The Ollama configuration is already set:
   ```env
   OLLAMA_API_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.1:8b
   ```

2. **Verify Installation**
   
   Check if Ollama is running:
   ```bash
   curl http://localhost:11434/api/tags
   ```

## API Endpoints

### 1. Ask for Spiritual Guidance
**POST** `/api/spiritual/ask`

Request body:
```json
{
  "question": "How can I find inner peace?",
  "context": "I'm dealing with stress at work" // optional
}
```

Response:
```json
{
  "question": "How can I find inner peace?",
  "guidance": "According to the Bhagavad Gita...",
  "timestamp": "2025-10-01T12:00:00.000Z"
}
```

### 2. Multi-turn Chat
**POST** `/api/spiritual/chat`

Request body:
```json
{
  "messages": [
    { "role": "user", "content": "What is dharma?" },
    { "role": "assistant", "content": "Dharma is..." },
    { "role": "user", "content": "How do I practice it?" }
  ]
}
```

### 3. Check Ollama Health
**GET** `/api/spiritual/health`

Response:
```json
{
  "status": "healthy",
  "ollama_available": true,
  "available_models": ["llama3.1:8b"],
  "current_model": "llama3.1:8b"
}
```

### 4. List Available Models
**GET** `/api/spiritual/models`

## System Prompt

The spiritual guidance uses a carefully crafted system prompt that:

- Draws upon core teachings of the Bhagavad Gita
- Covers Dharma, Karma Yoga, Bhakti Yoga, and Jnana Yoga
- Provides practical wisdom for modern life
- Maintains compassion and non-judgment
- References specific verses when relevant
- Encourages self-reflection and inner growth

## Frontend Usage

Navigate to the **Spiritual Guidance** page in the app:
- URL: `http://localhost:3000/spiritual`
- Enter your question
- Optionally provide context
- Receive guidance based on Bhagavad Gita teachings

## Features

✅ **Real-time spiritual guidance** using Llama 3.1 8B
✅ **Bhagavad Gita-focused** system prompt
✅ **Conversation history** tracking
✅ **Health monitoring** for Ollama service
✅ **Sample questions** to get started
✅ **Beautiful UI** with Tailwind CSS

## Troubleshooting

### Ollama not available
- Ensure Ollama is running: `ollama serve`
- Check if the service is accessible: `curl http://localhost:11434/api/tags`
- Verify the model is downloaded: `ollama list`

### Model not found
- Pull the model: `ollama pull llama3.1:8b`
- Check available models: `ollama list`

### Slow responses
- The first request may be slower as the model loads into memory
- Subsequent requests should be faster
- Consider using a smaller model if needed: `ollama pull llama3.1:3b`

### Port conflicts
- Change `OLLAMA_API_URL` in `.env` if Ollama runs on a different port
- Default port is 11434

## Alternative Models

You can use other models by changing `OLLAMA_MODEL` in `.env`:

```env
# Smaller, faster model (less accurate)
OLLAMA_MODEL=llama3.1:3b

# Larger, more accurate model (requires more resources)
OLLAMA_MODEL=llama3.1:70b

# Other models
OLLAMA_MODEL=mistral:7b
OLLAMA_MODEL=gemma:7b
```

## Performance Tips

1. **Keep Ollama running** - Starting the service takes time
2. **Preload the model** - Run a test query to load the model into memory
3. **Adjust temperature** - Modify in `server/services/ollamaService.js` for different response styles
4. **Use GPU** - Ollama automatically uses GPU if available for faster inference

## Testing

Test the integration with curl:

```bash
# Check health
curl http://localhost:5000/api/spiritual/health

# Ask a question
curl -X POST http://localhost:5000/api/spiritual/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What does the Bhagavad Gita say about duty?"
  }'
```

## Resources

- [Ollama Documentation](https://github.com/ollama/ollama)
- [Llama 3.1 Model Card](https://ollama.ai/library/llama3.1)
- [Bhagavad Gita Online](https://www.holy-bhagavad-gita.org/)

---

**Note**: The spiritual guidance is AI-generated and should be used as a tool for reflection, not as a replacement for traditional spiritual teachers or personal study of the Bhagavad Gita.
