# Render Deployment Fix - Musl/glibc Compatibility

## Problem

When deploying to Render, you encountered this error:
```
Error: Error relocating /app/node_modules/@libsql/linux-x64-musl/index.node: fcntl64: symbol not found
```

## Root Cause

This is a common issue with `@libsql/client` on different Linux distributions:

- **Alpine Linux** (musl libc): Used by Docker Alpine images
- **Debian/Ubuntu** (glibc): Used by Render's Node.js environment
- **Native modules**: Compiled for specific libc variants

The error occurs because the `linux-x64-musl` variant of `@libsql/client` expects musl libc, but Render's environment uses glibc.

## Solution Implemented

### 1. Updated package.json
Added a custom `install` script that installs the glibc-compatible variant first:

```json
{
  "scripts": {
    "install": "npm install @libsql/linux-x64-gnu --save-optional && npm install"
  }
}
```

**How it works:**
1. Installs `@libsql/linux-x64-gnu` (glibc compatible) as optional dependency
2. Runs the standard `npm install`
3. Node.js will automatically prefer the glibc version on glibc systems

### 2. Updated Dockerfile
Changed from Alpine to Debian-based image:

```dockerfile
# Before (Alpine - musl libc)
FROM node:18-alpine

# After (Debian - glibc)
FROM node:18-bullseye
```

### 3. Updated render.yaml
Changed build command to use custom install script:

```yaml
# Before
buildCommand: npm install

# After  
buildCommand: npm run install
```

## Files Modified

1. **package.json** - Added custom install script
2. **Dockerfile** - Changed base image to Debian
3. **render.yaml** - Updated build command

## Why This Works

1. **Optional Dependencies**: `--save-optional` allows both variants to coexist
2. **Automatic Selection**: Node.js automatically chooses the correct binary for the system
3. **Fallback**: If the preferred variant fails, it falls back to the other
4. **Render Compatibility**: Render uses glibc, so `linux-x64-gnu` is selected

## Testing the Fix

### Local Testing
```bash
# Clean install to test
rm -rf node_modules package-lock.json
npm run install

# Test Turso connection
node -e "const { createClient } = require('@libsql/client'); console.log('✅ @libsql/client loaded successfully');"
```

### Render Deployment
1. Commit the changes
2. Push to GitHub
3. Render will automatically redeploy
4. Check build logs for successful installation

## Alternative Solutions

### Option 1: Use Turso Cloud (Recommended for Production)
```bash
# Instead of local database, use Turso cloud
turso db create sarthi-gita --location ams
turso db tokens create sarthi-gita
```

Set environment variables:
```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

### Option 2: Use HTTP Mode
Modify `server/config/turso.js` to use HTTP instead of local file:

```javascript
const config = {
  url: process.env.TURSO_DATABASE_URL || 'http://localhost:8080',
  authToken: process.env.TURSO_AUTH_TOKEN,
};
```

### Option 3: Use SQLite as Fallback
If Turso issues persist, use SQLite for simplicity:

```javascript
// In server/config/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./server/database/sarthi.db');
```

## Verification

After deployment, verify the fix:

1. **Check Build Logs**: Look for successful `@libsql/client` installation
2. **Health Check**: `curl https://sarthi-backend.onrender.com/api/health`
3. **Database Test**: `curl https://sarthi-backend.onrender.com/api/gita/stats`

## Expected Build Log Output

You should see something like:
```
> npm run install
> npm install @libsql/linux-x64-gnu --save-optional && npm install

added 1 package, and audited 123 packages in 5s

added 45 packages from 32 contributors, and audited 168 packages in 10s
```

## Troubleshooting

### If the Fix Doesn't Work

1. **Check Node.js Version**: Ensure you're using Node.js 18+
2. **Clean Reinstall**: Delete `node_modules` and `package-lock.json`
3. **Check Render Logs**: Look for specific error messages
4. **Try Turso Cloud**: Use remote database instead of local

### If You Still Get Errors

```bash
# Force clean install
npm cache clean --force
rm -rf node_modules package-lock.json
npm run install
```

## Long-term Solution

For production deployment, consider:

1. **Use Turso Cloud**: More reliable than local database
2. **Environment-Specific Config**: Different configs for dev/prod
3. **Database Migration**: Proper migration scripts
4. **Monitoring**: Database connection monitoring

---

✅ **This fix should resolve the musl/glibc compatibility issue on Render!**

The changes ensure that the correct `@libsql/client` binary is installed for Render's glibc-based environment. 🙏✨
