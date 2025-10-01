# Deployment Guide - Render & Vercel

## Overview

This guide covers deploying Sarthi to production:
- **Backend**: Render (Node.js API + Turso database)
- **Frontend**: Vercel (React SPA)
- **AI Service**: External Ollama or API alternative

## Architecture

```
┌─────────────────────────────────────────┐
│         Vercel (Frontend)               │
│    https://sarthi.vercel.app            │
│    - React App                          │
│    - Static hosting                     │
│    - CDN distribution                   │
└─────────────────────────────────────────┘
                  ↓ API Calls
┌─────────────────────────────────────────┐
│      Render (Backend)                   │
│  https://sarthi-backend.onrender.com    │
│    - Node.js/Express API                │
│    - CORS configured                    │
│    - Health checks                      │
└─────────────────────────────────────────┘
                  ↓
        ┌─────────────────┬─────────────────┐
        ↓                 ↓                  ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Turso Cloud  │  │ Ollama API   │  │ External AI  │
│ (Database)   │  │ (Self-hosted)│  │ (Alternative)│
└──────────────┘  └──────────────┘  └──────────────┘
```

## Prerequisites

1. **Accounts**:
   - GitHub account (for code repository)
   - Render account (https://render.com)
   - Vercel account (https://vercel.com)
   - Turso account (https://turso.tech) - optional

2. **Prepared**:
   - Code pushed to GitHub
   - Environment variables ready
   - Database populated with Gita verses

## Part 1: Backend Deployment (Render)

### Step 1: Prepare Repository

```bash
# Ensure all code is committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Turso Cloud Database (Recommended)

```bash
# Install Turso CLI
brew install tursodatabase/tap/turso

# Login
turso auth signup

# Create database
turso db create sarthi-gita

# Get database URL
turso db show sarthi-gita --url

# Create auth token
turso db tokens create sarthi-gita

# Copy both values for later
```

### Step 3: Deploy to Render

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub account
   - Select `sarthi` repository
   - Click "Connect"

3. **Configure Service**
   ```
   Name: sarthi-backend
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: (leave empty)
   Runtime: Node
   Build Command: npm install
   Start Command: node server/index.js
   Plan: Starter ($7/month) or Free
   ```

4. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=5001
   
   # Turso Database
   TURSO_DATABASE_URL=libsql://your-db.turso.io
   TURSO_AUTH_TOKEN=your_token_here
   
   # JWT Secret (generate random string)
   JWT_SECRET=your_random_secret_here
   
   # CORS (add your Vercel URL later)
   ALLOWED_ORIGINS=https://sarthi.vercel.app
   
   # Ollama (if using external service)
   OLLAMA_API_URL=https://your-ollama-service.com
   OLLAMA_MODEL=llama3.1:8b
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://sarthi-backend.onrender.com`

### Step 4: Populate Database

```bash
# SSH into Render service or run locally
npm run setup-turso
npm run ingest-gita

# Or use Turso CLI to import data
turso db shell sarthi-gita < backup.sql
```

### Step 5: Test Backend

```bash
# Health check
curl https://sarthi-backend.onrender.com/api/health

# Test guidance endpoint
curl -X POST https://sarthi-backend.onrender.com/api/guidance/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "How to find peace?"}'
```

## Part 2: Frontend Deployment (Vercel)

### Step 1: Update API Configuration

The frontend is already configured to use environment variables.

In `client/src/config/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  'https://sarthi-backend.onrender.com';
```

### Step 2: Deploy to Vercel

**Option A: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from client directory
cd client
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? sarthi-frontend
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Option B: Vercel Dashboard**

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Click "Import Git Repository"
   - Select `sarthi` repository
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Create React App
   Root Directory: client
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

4. **Add Environment Variables**
   ```
   REACT_APP_API_URL=https://sarthi-backend.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (3-5 minutes)
   - Note your frontend URL: `https://sarthi.vercel.app`

### Step 3: Update CORS on Backend

Go back to Render and update environment variable:
```
ALLOWED_ORIGINS=https://sarthi.vercel.app,https://sarthi-frontend.vercel.app
```

Redeploy backend for changes to take effect.

### Step 4: Test Frontend

1. Visit `https://sarthi.vercel.app/guidance`
2. Enter a question
3. Verify response from backend
4. Check verse citations

## Part 3: Ollama/AI Service

### Option 1: Self-Hosted Ollama (Recommended for Development)

**Not recommended for production** due to resource requirements.

### Option 2: External Ollama Service

Deploy Ollama on a separate server:

```bash
# On a VPS (e.g., DigitalOcean, AWS EC2)
curl -fsSL https://ollama.com/install.sh | sh
ollama serve
ollama pull llama3.1:8b

# Expose via reverse proxy (Nginx)
# Update backend env: OLLAMA_API_URL=https://your-ollama-server.com
```

### Option 3: Alternative AI API

Replace Ollama with OpenAI, Anthropic, or other API:

```javascript
// In server/services/ollamaService.js
// Replace with your preferred AI service
```

## Part 4: Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain (e.g., `sarthi.yourdomain.com`)
4. Update DNS records as instructed
5. Wait for SSL certificate

### Render Custom Domain

1. Go to Render service settings
2. Click "Custom Domain"
3. Add your domain (e.g., `api.yourdomain.com`)
4. Update DNS records
5. Wait for SSL certificate

## Environment Variables Summary

### Backend (Render)
```env
NODE_ENV=production
PORT=5001
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_token_here
JWT_SECRET=random_secret_string
ALLOWED_ORIGINS=https://sarthi.vercel.app
OLLAMA_API_URL=https://your-ollama-service.com
OLLAMA_MODEL=llama3.1:8b
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://sarthi-backend.onrender.com
```

## Monitoring & Maintenance

### Render Monitoring

1. **Logs**: View in Render dashboard
2. **Metrics**: CPU, memory usage
3. **Health Checks**: Automatic via `/api/health`
4. **Alerts**: Set up email notifications

### Vercel Monitoring

1. **Analytics**: Built-in analytics
2. **Logs**: Function logs in dashboard
3. **Performance**: Web Vitals tracking
4. **Errors**: Automatic error tracking

### Database Monitoring

```bash
# Check Turso database stats
turso db inspect sarthi-gita

# View usage
turso db usage sarthi-gita
```

## Troubleshooting

### Backend Issues

**Issue**: 503 Service Unavailable
```bash
# Check Render logs
# Verify Ollama service is running
# Check database connection
```

**Issue**: CORS errors
```bash
# Verify ALLOWED_ORIGINS includes your Vercel URL
# Check frontend is using correct API URL
```

### Frontend Issues

**Issue**: API calls failing
```bash
# Check REACT_APP_API_URL is set correctly
# Verify backend is running
# Check browser console for errors
```

**Issue**: Build failures
```bash
# Check all dependencies are in package.json
# Verify build command is correct
# Check for TypeScript errors
```

### Database Issues

**Issue**: No verses found
```bash
# Verify database is populated
# Check TURSO_DATABASE_URL is correct
# Run migration scripts
```

## Scaling Considerations

### Backend Scaling

1. **Vertical**: Upgrade Render plan
2. **Horizontal**: Add more instances (Render Pro)
3. **Caching**: Add Redis for verse caching
4. **CDN**: Use Cloudflare for API caching

### Database Scaling

1. **Turso**: Automatically scales
2. **Replication**: Enable read replicas
3. **Caching**: Cache frequent queries

### AI Service Scaling

1. **Queue**: Add job queue for AI requests
2. **Rate Limiting**: Implement rate limits
3. **Caching**: Cache common responses

## Cost Estimation

### Free Tier
- **Render**: Free tier available (with limitations)
- **Vercel**: Free tier (hobby projects)
- **Turso**: Free tier (500 DB rows/month)
- **Total**: $0/month

### Paid Tier
- **Render**: $7/month (Starter)
- **Vercel**: $20/month (Pro) - optional
- **Turso**: $29/month (Scaler) - optional
- **VPS for Ollama**: $10-50/month
- **Total**: ~$17-100/month

## Security Checklist

- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (React default)
- [ ] JWT secrets rotated regularly
- [ ] Database backups enabled

## Backup Strategy

### Database Backups

```bash
# Export Turso database
turso db shell sarthi-gita .dump > backup.sql

# Schedule daily backups
# Use GitHub Actions or cron job
```

### Code Backups

- GitHub repository (automatic)
- Tag releases: `git tag v1.0.0`

## CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          # Render auto-deploys on push
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          # Vercel auto-deploys on push
```

## Post-Deployment

1. **Test all features**
   - Search verses
   - Get guidance
   - Check error handling
   - Test on mobile

2. **Monitor performance**
   - Response times
   - Error rates
   - User analytics

3. **Set up alerts**
   - Downtime notifications
   - Error tracking
   - Usage limits

4. **Document**
   - API endpoints
   - User guide
   - Admin procedures

---

**Your Sarthi application is now deployed!** 🚀

- Frontend: https://sarthi.vercel.app
- Backend: https://sarthi-backend.onrender.com
- API Docs: https://sarthi-backend.onrender.com/api/health

🙏 May your application serve seekers of wisdom well! ✨
