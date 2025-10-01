# Render Deployment Troubleshooting Guide

## 🚨 Stuck on Build Phase? Here's How to Fix It

### Step 1: Check Render Logs

**Access Build Logs:**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your `sarthi-backend` service
3. Click on the **"Logs"** tab
4. Look for the latest build attempt
5. Scroll to see where it's stuck

**Common Stuck Points:**
- `npm install` hanging
- `npm run install` not completing
- `@libsql/client` installation issues
- Network timeouts
- Memory limits exceeded

### Step 2: Common Issues & Fixes

#### Issue 1: npm install Hanging
**Symptoms:**
- Build stuck at `npm install` or `npm run install`
- No progress for >10 minutes
- Build eventually times out

**Causes:**
- Network issues downloading packages
- Large dependency tree
- npm registry issues
- Memory constraints

**Solutions:**

**Option A: Use npm ci instead**
```bash
# Update render.yaml
buildCommand: npm ci
```

**Option B: Increase timeout**
```yaml
# In render.yaml (add this)
buildTimeout: 1200  # 20 minutes
```

**Option C: Clean install**
```bash
# Update package.json script
"install": "npm cache clean --force && npm install @libsql/linux-x64-gnu --save-optional && npm install"
```

#### Issue 2: @libsql/client Installation Failed
**Symptoms:**
- Error: `Error relocating /app/node_modules/@libsql/linux-x64-musl/index.node: fcntl64: symbol not found`
- Build fails during native module compilation

**Our Fix Should Work, But If Not:**

**Option A: Verify our fix is applied**
```bash
# Check if the fix is in your latest commit
git log --oneline -1
# Should show: "Fix Render deployment: Resolve musl/glibc compatibility issue"
```

**Option B: Manual fix in Render dashboard**
1. Go to Render dashboard
2. Edit Environment Variables
3. Add build-specific variable:
   ```
   NPM_CONFIG_INCLUDE=optional
   ```

**Option C: Use Turso HTTP mode**
```javascript
// In server/config/turso.js
const config = {
  url: process.env.TURSO_DATABASE_URL || 'http://localhost:8080',
  authToken: process.env.TURSO_AUTH_TOKEN,
};
```

#### Issue 3: Memory Limits Exceeded
**Symptoms:**
- Build fails with "killed" or "out of memory"
- Process terminated unexpectedly

**Solutions:**

**Option A: Upgrade Render plan**
- Upgrade from Starter to Standard plan
- More memory and CPU resources

**Option B: Optimize dependencies**
```json
// package.json - install only production dependencies
"scripts": {
  "install": "npm install @libsql/linux-x64-gnu --save-optional && npm install --production"
}
```

**Option C: Split installation**
```json
"scripts": {
  "install-deps": "npm install @libsql/linux-x64-gnu --save-optional",
  "install-prod": "npm install --production",
  "install": "npm run install-deps && npm run install-prod"
}
```

### Step 3: Quick Fixes to Try

#### Fix 1: Force Rebuild
1. Go to Render dashboard
2. Click "Manual Deploy"
3. Select "Clear build cache" option
4. Deploy again

#### Fix 2: Update Build Command
```yaml
# render.yaml - try this build command
buildCommand: |
  npm cache clean --force
  npm install @libsql/linux-x64-gnu --save-optional
  npm ci --only=production
```

#### Fix 3: Use Different Node Version
```yaml
# render.yaml - add this
envVars:
  - key: NODE_VERSION
    value: 18.19.0
```

### Step 4: Diagnostic Commands

**Test Locally:**
```bash
# Clean install test
rm -rf node_modules package-lock.json
npm run install

# Check if @libsql works
node -e "const { createClient } = require('@libsql/client'); console.log('✅ @libsql/client works!');"

# Test Turso connection
node -e "
const { createClient } = require('@libsql/client');
const client = createClient({ url: 'file:./server/database/gita.db' });
console.log('✅ Turso connection test passed');
"
```

**Check Package.json:**
```bash
# Verify our fix is there
cat package.json | grep -A 2 '"install"'
# Should show: "install": "npm install @libsql/linux-x64-gnu --save-optional && npm install"
```

### Step 5: Alternative Solutions

#### Option A: Use SQLite Instead of Turso
If Turso continues to cause issues:

```javascript
// server/config/database.js - fallback to SQLite
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./server/database/sarthi.db');

// Simple test
db.get('SELECT 1 as test', (err, row) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('✅ SQLite connection works');
  }
});
```

#### Option B: Use External Database
```env
# In Render environment variables
DATABASE_URL=postgresql://user:pass@host:port/db
# Or use any external database service
```

### Step 6: Render-Specific Solutions

#### Enable Debug Logging
```yaml
# render.yaml - add debug variables
envVars:
  - key: NPM_CONFIG_LOGLEVEL
    value: verbose
  - key: DEBUG
    value: *
```

#### Use Render Buildpacks
```yaml
# render.yaml - specify Node.js buildpack
buildpacks:
  - url: https://github.com/render-oss/buildpack-nodejs
```

### Step 7: When All Else Fails

#### Contact Render Support
1. Go to Render dashboard
2. Click "Help" → "Contact Support"
3. Provide:
   - Service name: `sarthi-backend`
   - Build logs (copy/paste)
   - Repository: `https://github.com/purohitaarav/sarthi`
   - Error messages

#### Try Different Deployment Platform
If Render continues to have issues:

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

**Heroku:**
```bash
# Install Heroku CLI
npm install -g heroku
heroku login
heroku create sarthi-backend
git push heroku main
```

### Step 8: Prevention for Future

#### Optimize Dependencies
```json
// package.json - reduce dependency size
"dependencies": {
  "@libsql/client": "^0.5.0",
  "express": "^4.18.2",
  "cors": "^2.8.5"
  // Remove unnecessary packages
}
```

#### Use .dockerignore
```dockerfile
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
```

#### Add Health Checks
```javascript
// server/index.js - add health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});
```

### 📋 Quick Checklist

**Before Next Deploy:**
- [ ] Our fix commit is pushed (`0189b8b`)
- [ ] `render.yaml` uses `npm run install`
- [ ] `Dockerfile` uses `node:18-bullseye`
- [ ] Environment variables are set
- [ ] Build timeout is adequate

**If Build Fails:**
- [ ] Check Render logs for specific error
- [ ] Try "Clear build cache" and redeploy
- [ ] Verify `@libsql/linux-x64-gnu` is installed
- [ ] Test locally with same commands
- [ ] Consider alternative database solution

### 🚀 Expected Success Indicators

**Successful Build Log:**
```
> npm run install
> npm install @libsql/linux-x64-gnu --save-optional && npm install

added 1 package, and audited 123 packages in 5s

added 45 packages from 32 contributors, and audited 168 packages in 10s
✅ Build completed successfully
```

**Successful Health Check:**
```bash
curl https://sarthi-backend.onrender.com/api/health
# Should return: {"status":"ok","timestamp":"...","database":"connected"}
```

---

## 🆘 Still Stuck?

If you're still having issues, please:

1. **Copy the error message** from Render logs
2. **Share the build log** (last 50 lines)
3. **Tell me where it gets stuck** (which step)
4. **Try the quick fixes** above first

I'll help you diagnose and fix the specific issue! 🙏✨
