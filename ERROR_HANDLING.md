# Error Handling & CORS Configuration

## Overview

The Sarthi Express server now includes comprehensive error handling and CORS configuration to ensure robust API operations and secure cross-origin requests.

## CORS Configuration

### Features

**Development Mode:**
- Allows all origins (`*`)
- Full access for local development
- No restrictions on methods or headers

**Production Mode:**
- Configurable allowed origins via environment variable
- Supports multiple domains (comma-separated)
- Credentials support enabled
- 24-hour preflight cache

### Configuration

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || '*'
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};
```

### Environment Variables

Add to `.env` for production:
```env
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Error Handling

### 1. Request Logging

All requests are automatically logged with:
- HTTP method
- Request path
- Response status code
- Response time in milliseconds

**Example Output:**
```
GET /api/health - 200 (3ms)
POST /api/guidance/ask - 200 (8234ms)
GET /api/nonexistent - 404 (1ms)
```

### 2. 404 Not Found Handler

Returns helpful information when a route doesn't exist:

**Request:**
```bash
GET /api/nonexistent
```

**Response:**
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Route GET /api/nonexistent not found",
  "availableEndpoints": [
    "GET /api/health",
    "GET /api/users",
    "GET /api/items",
    "POST /api/spiritual/ask",
    "GET /api/gita/chapters",
    "GET /api/guidance/verses",
    "POST /api/guidance/ask"
  ]
}
```

### 3. Global Error Handler

Catches all errors and returns consistent error responses.

**Development Mode:**
- Includes full stack trace
- Shows request path and method
- Detailed error information

**Production Mode:**
- Sanitized error messages
- No stack traces exposed
- Secure error responses

**Error Response Format:**
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Invalid input data",
  "timestamp": "2025-10-01T17:00:00.000Z",
  "stack": "Error: ...",  // Only in development
  "path": "/api/users",   // Only in development
  "method": "POST"        // Only in development
}
```

### 4. Specific Error Types

The error handler recognizes and properly handles:

**ValidationError (400)**
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Validation failed",
  "details": { "field": "email", "issue": "Invalid format" }
}
```

**UnauthorizedError (401)**
```json
{
  "success": false,
  "error": "UnauthorizedError",
  "message": "Authentication required"
}
```

**ForbiddenError (403)**
```json
{
  "success": false,
  "error": "ForbiddenError",
  "message": "Access denied"
}
```

**NotFoundError (404)**
```json
{
  "success": false,
  "error": "NotFoundError",
  "message": "Resource not found"
}
```

**Internal Server Error (500)**
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

### 5. Process-Level Error Handling

**Uncaught Exceptions:**
```javascript
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});
```

**Unhandled Promise Rejections:**
```javascript
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});
```

## Enhanced Health Check

The health endpoint now returns additional information:

**Request:**
```bash
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Sarthi API is running",
  "timestamp": "2025-10-01T17:00:21.311Z",
  "uptime": 12.335983583
}
```

**Fields:**
- `status`: Server status (OK/ERROR)
- `message`: Human-readable message
- `timestamp`: Current server time
- `uptime`: Server uptime in seconds

## Request Size Limits

To prevent abuse and ensure stability:

```javascript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

- Maximum JSON payload: 10MB
- Maximum URL-encoded payload: 10MB

## Usage Examples

### Testing CORS

```bash
# Test from browser console
fetch('http://localhost:5001/api/health')
  .then(r => r.json())
  .then(console.log);

# Test with curl
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:5001/api/guidance/ask
```

### Testing Error Handling

```bash
# Test 404
curl http://localhost:5001/api/nonexistent

# Test invalid JSON
curl -X POST http://localhost:5001/api/guidance/ask \
  -H "Content-Type: application/json" \
  -d 'invalid json'

# Test missing required field
curl -X POST http://localhost:5001/api/guidance/ask \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Custom Error Throwing

In your route handlers:

```javascript
// Validation error
if (!req.body.query) {
  const error = new Error('Query is required');
  error.name = 'ValidationError';
  error.statusCode = 400;
  throw error;
}

// Not found error
if (!user) {
  const error = new Error('User not found');
  error.name = 'NotFoundError';
  error.statusCode = 404;
  throw error;
}

// Unauthorized error
if (!token) {
  const error = new Error('Authentication required');
  error.name = 'UnauthorizedError';
  error.statusCode = 401;
  throw error;
}
```

## Best Practices

### 1. Always Use Try-Catch in Async Routes

```javascript
router.get('/example', async (req, res, next) => {
  try {
    const data = await someAsyncOperation();
    res.json({ success: true, data });
  } catch (error) {
    next(error); // Pass to error handler
  }
});
```

### 2. Use Consistent Error Format

```javascript
res.status(400).json({
  success: false,
  error: 'ValidationError',
  message: 'Descriptive error message'
});
```

### 3. Log Errors Appropriately

```javascript
console.error('Error in /api/users:', error.message);
console.error('Stack:', error.stack);
```

### 4. Don't Expose Sensitive Information

```javascript
// ❌ Bad
res.status(500).json({ error: error.stack });

// ✅ Good
res.status(500).json({ 
  error: 'Internal Server Error',
  message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
});
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure `ALLOWED_ORIGINS` with your domains
- [ ] Set up proper logging service (e.g., Winston, Morgan)
- [ ] Implement rate limiting
- [ ] Add request validation middleware
- [ ] Set up monitoring and alerts
- [ ] Configure proper SSL/TLS certificates
- [ ] Test all error scenarios

## Monitoring

Consider adding these for production:

```javascript
// Request rate monitoring
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Advanced logging
const morgan = require('morgan');
app.use(morgan('combined'));

// Helmet for security headers
const helmet = require('helmet');
app.use(helmet());
```

## Troubleshooting

### CORS Issues

**Problem:** Browser shows CORS error
**Solution:** 
1. Check `ALLOWED_ORIGINS` includes your frontend URL
2. Verify `credentials: true` if sending cookies
3. Ensure preflight requests are handled

### 404 on Valid Routes

**Problem:** Getting 404 on routes that should exist
**Solution:**
1. Check route is registered before 404 handler
2. Verify route path matches exactly
3. Check HTTP method (GET vs POST)

### Errors Not Being Caught

**Problem:** Errors crash the server
**Solution:**
1. Wrap async functions in try-catch
2. Use `next(error)` to pass to error handler
3. Check for unhandled promise rejections

---

**Your Express server now has production-ready error handling and CORS configuration!** 🛡️
