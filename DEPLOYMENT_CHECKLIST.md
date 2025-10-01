# Deployment Checklist

## Pre-Deployment

### Code Preparation
- [ ] All code committed to Git
- [ ] Tests passing (if any)
- [ ] No console.log statements in production code
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] API endpoints documented

### Database Setup
- [ ] Turso account created
- [ ] Database created: `turso db create sarthi-gita`
- [ ] Auth token generated: `turso db tokens create sarthi-gita`
- [ ] Database populated with 653 verses
- [ ] Database URL and token saved securely

### Repository Setup
- [ ] Code pushed to GitHub
- [ ] Repository is public or connected to Render/Vercel
- [ ] README.md updated
- [ ] .gitignore configured
- [ ] .env.example provided

## Backend Deployment (Render)

### Account Setup
- [ ] Render account created
- [ ] Payment method added (if using paid tier)
- [ ] GitHub connected to Render

### Service Configuration
- [ ] New Web Service created
- [ ] Repository connected
- [ ] Build command: `npm install`
- [ ] Start command: `node server/index.js`
- [ ] Region selected (Oregon recommended)
- [ ] Plan selected (Starter or Free)

### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=5001`
- [ ] `TURSO_DATABASE_URL` set
- [ ] `TURSO_AUTH_TOKEN` set
- [ ] `JWT_SECRET` generated and set
- [ ] `ALLOWED_ORIGINS` configured
- [ ] `OLLAMA_API_URL` set (if using external)
- [ ] `OLLAMA_MODEL=llama3.1:8b`

### Deployment
- [ ] Service deployed successfully
- [ ] Build logs checked for errors
- [ ] Service is running
- [ ] Backend URL noted: `https://sarthi-backend.onrender.com`

### Testing
- [ ] Health check works: `curl https://sarthi-backend.onrender.com/api/health`
- [ ] Chapters endpoint works: `/api/gita/chapters`
- [ ] Stats endpoint shows 653 verses: `/api/gita/stats`
- [ ] Guidance endpoint tested (if Ollama available)

## Frontend Deployment (Vercel)

### Account Setup
- [ ] Vercel account created
- [ ] GitHub connected to Vercel

### Project Configuration
- [ ] New Project created
- [ ] Repository imported
- [ ] Framework: Create React App
- [ ] Root Directory: `client`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`

### Environment Variables
- [ ] `REACT_APP_API_URL` set to backend URL

### Deployment
- [ ] Project deployed successfully
- [ ] Build logs checked
- [ ] Frontend URL noted: `https://sarthi.vercel.app`

### Testing
- [ ] Homepage loads
- [ ] `/guidance` page loads
- [ ] Can submit questions
- [ ] Receives responses from backend
- [ ] Verses display correctly
- [ ] Mobile responsive
- [ ] All routes work

## Post-Deployment

### CORS Configuration
- [ ] Backend ALLOWED_ORIGINS updated with Vercel URL
- [ ] Backend redeployed
- [ ] CORS tested from frontend

### Final Testing
- [ ] End-to-end test: Ask question → Get response
- [ ] Error handling works (try with Ollama off)
- [ ] Loading states display correctly
- [ ] Verse cards render properly
- [ ] Navigation works
- [ ] Mobile testing complete

### Monitoring Setup
- [ ] Render health checks enabled
- [ ] Vercel analytics enabled (optional)
- [ ] Error tracking configured (optional)
- [ ] Uptime monitoring (optional)

### Documentation
- [ ] API documentation updated
- [ ] User guide created (optional)
- [ ] Deployment guide reviewed
- [ ] Environment variables documented

## Optional Enhancements

### Custom Domain
- [ ] Domain purchased
- [ ] DNS configured for Vercel
- [ ] DNS configured for Render
- [ ] SSL certificates active

### AI Service
- [ ] Ollama deployed on VPS (if self-hosting)
- [ ] Or alternative AI API configured
- [ ] API key secured
- [ ] Rate limiting configured

### Performance
- [ ] CDN configured (Vercel automatic)
- [ ] Caching strategy implemented
- [ ] Database indexes optimized
- [ ] Response times acceptable (< 10s for AI)

### Security
- [ ] HTTPS enforced (automatic)
- [ ] Environment variables secured
- [ ] Rate limiting added
- [ ] Input validation verified
- [ ] CORS properly configured
- [ ] Security headers added

### Backup
- [ ] Database backup script created
- [ ] Backup schedule configured
- [ ] Backup tested and verified
- [ ] Recovery procedure documented

## Launch

### Pre-Launch
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] Mobile experience good
- [ ] Error handling working
- [ ] Analytics configured

### Launch
- [ ] Announce to users
- [ ] Share URL: https://sarthi.vercel.app
- [ ] Monitor for issues
- [ ] Respond to feedback

### Post-Launch
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Plan improvements

## Maintenance Schedule

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review usage stats

### Weekly
- [ ] Review performance metrics
- [ ] Check database health
- [ ] Update dependencies (if needed)

### Monthly
- [ ] Database backup verification
- [ ] Security audit
- [ ] Cost review
- [ ] Feature planning

## Rollback Plan

If deployment fails:

1. **Backend Issues**
   - [ ] Revert to previous Render deployment
   - [ ] Check environment variables
   - [ ] Review error logs
   - [ ] Test database connection

2. **Frontend Issues**
   - [ ] Revert to previous Vercel deployment
   - [ ] Check build logs
   - [ ] Verify API URL
   - [ ] Test locally first

3. **Database Issues**
   - [ ] Restore from backup
   - [ ] Verify connection string
   - [ ] Check auth token
   - [ ] Re-run migrations

## Support Contacts

- **Render Support**: https://render.com/docs
- **Vercel Support**: https://vercel.com/support
- **Turso Support**: https://docs.turso.tech

## Success Criteria

Deployment is successful when:
- [ ] Frontend loads without errors
- [ ] Backend API responds correctly
- [ ] Database queries work
- [ ] AI guidance returns responses
- [ ] All 653 verses accessible
- [ ] Mobile experience smooth
- [ ] Error handling graceful
- [ ] Performance acceptable

---

**Ready to deploy!** Follow this checklist step by step. 🚀

**Estimated Time**: 2-3 hours for first deployment

**Difficulty**: Intermediate

**Cost**: $0-100/month depending on tier

🙏 Good luck with your deployment! ✨
