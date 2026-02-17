# Quick Deployment Reference

## 🎯 Recommended: Vercel + Render + MongoDB Atlas

**Estimated Time**: 30 minutes
**Estimated Cost**: Free tier (or ~$5-10/month)

---

## Phase 1: MongoDB Atlas Setup (10 min)

```bash
# 1. Go to: https://www.mongodb.com/cloud/atlas
# 2. Sign up free
# 3. Create organization → project → cluster (M0 Free)
# 4. Create database user:
#    - Username: skillgap_user
#    - Password: [Generate strong password]
# 5. Whitelist IPs: Network Access → Add IP → 0.0.0.0/0 (development)
# 6. Get connection string:
#    mongodb+srv://skillgap_user:PASSWORD@cluster0.xxxxx.mongodb.net/skillgapmapper?retryWrites=true&w=majority
```

**Save this**: Copy your connection string (you'll need it later)

---

## Phase 2: Push to GitHub (5 min)

```bash
# 1. Create GitHub account (if not already)
# 2. Create new repository:
cd skill-gap-mapper
git init
git add .
git commit -m "Initial commit - ready for production"

# 3. Add remote and push:
git remote add origin https://github.com/YOUR_USERNAME/skill-gap-mapper.git
git branch -M main
git push -u origin main
```

---

## Phase 3: Deploy Backend (10 min)

### Option A: Render (Recommended)

```
1. Go to: https://render.com
2. Email signup (free)
3. Click "New +" → "Web Service"
4. Connect GitHub → select skill-gap-mapper repo
5. Settings:
   - Name: skill-gap-mapper-api
   - Environment: Node
   - Build: npm install
   - Start: npm run start
   - Root: backend/
6. Click "Create Web Service"
7. Wait for deployment (2-3 minutes)
8. Copy URL: https://skill-gap-mapper-api-xxx.onrender.com
```

**Add Environment Variables:**
```
Go to: Environment → Add Variable

Add each:
MONGODB_URI = mongodb+srv://skillgap_user:PASSWORD@cluster0.xxxxx.mongodb.net/skillgapmapper
JWT_SECRET = change_me_to_long_random_string_here_min_32_characters_123456789
OPENAI_API_KEY = sk-... (optional)
NODE_ENV = production
PORT = 5000
CLIENT_URL = https://your-frontend-url.vercel.app

Save → Auto-deploys
```

### Option B: Railway

```
1. Go to: https://railway.app
2. Sign up with GitHub
3. "Create Project" → "Deploy from GitHub"
4. Select "skill-gap-mapper"
5. Railway auto-configures for Node
6. Add environment variables (same as above)
7. Copy backend URL
```

**Your Backend URL**: https://skill-gap-mapper-api-xxx.onrender.com

---

## Phase 4: Deploy Frontend (5 min)

### Option A: Vercel (Fastest)

```
1. Go to: https://vercel.com
2. Sign up with GitHub
3. "Add new..." → "Project"
4. Import GitHub repo: skill-gap-mapper
5. Settings:
   - Root directory: frontend
   - Framework: Next.js / React
   - Build: npm run build
   - Install: npm install
6. Click "Deploy"
7. Wait for deployment (<1 minute)
8. Copy URL: https://skill-gap-mapper-xxx.vercel.app
```

**Add Environment Variable:**
```
Go to: Settings → Environment Variables
Add: REACT_APP_API_URL = https://skill-gap-mapper-api-xxx.onrender.com/api
Redeploy by going to Deployments and clicking redeploy
```

### Option B: Netlify

```
1. Go to: https://netlify.com
2. Sign up with GitHub
3. "Import an existing project"
4. Select GitHub → skill-gap-mapper
5. Settings:
   - Base directory: frontend
   - Build: npm run build
   - Publish: build
6. Click "Deploy site"
7. Wait for deployment (<2 minutes)
8. Copy URL: https://skill-gap-mapper-xxx.netlify.app
```

**Add Environment Variable:**
```
Go to: Site settings → Build & deploy → Environment
Add: REACT_APP_API_URL = https://skill-gap-mapper-api-xxx.onrender.com/api
Trigger redeploy
```

**Your Frontend URL**: https://skill-gap-mapper-xxx.vercel.app

---

## Phase 5: Configure CORS (2 min)

Update backend for production domain:

**File**: `backend/server.js`

```javascript
app.use(cors({ 
  origin: [
    'https://YOUR_FRONTEND_URL.vercel.app',  // Add your actual frontend URL
    'http://localhost:3000'  // Keep for local development
  ], 
  credentials: true 
}));
```

Then:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Backend will auto-redeploy on Render/Railway

---

## Phase 6: Test Production (5 min)

```
1. Go to your frontend URL
2. Register new account
3. Login
4. Upload resume PDF (with skills keywords)
5. Check skills are extracted
6. Select job and analyze
7. View skill gap results

If issues:
- Check browser console (F12) for errors
- Check backend logs on Render/Railway dashboard
- Verify API URL is correct
```

---

## Environment Variables Checklist

### Backend Variables
```
✓ MONGODB_URI  → MongoDB Atlas connection string
✓ JWT_SECRET   → Random 32+ character string
✓ NODE_ENV     → production
✓ PORT         → 5000
✓ CLIENT_URL   → Your frontend domain
✓ OPENAI_API_KEY → (optional) sk-...
```

### Frontend Variables
```
✓ REACT_APP_API_URL → Your backend domain + /api
```

---

## URLs After Deployment

```
Frontend: https://skill-gap-mapper-xxx.vercel.app
Backend:  https://skill-gap-mapper-api-xxx.onrender.com
Database: MongoDB Atlas (cloud)
```

---

## Common Issues & Solutions

### 1. "Cannot connect to API"
```
Reason: Backend URL not set in frontend
Solution: 
1. Check REACT_APP_API_URL env variable
2. Should be: https://your-backend.onrender.com/api (with /api)
3. Redeploy frontend
```

### 2. "CORS error"
```
Reason: Frontend domain not whitelisted
Solution:
1. Update backend/server.js with frontend domain
2. Push to GitHub
3. Backend auto-redeploys
```

### 3. "MongoDB connection timeout"
```
Reason: IP not whitelisted or wrong connection string
Solution:
1. Go to MongoDB Atlas → Network Access
2. Add server IP to whitelist
3. Verify MONGODB_URI is exactly right
4. Check password has no special chars (or URL-encode them)
```

### 4. "Build fails on Vercel/Netlify"
```
Reason: Missing dependencies or wrong directory
Solution:
1. Check build logs
2. Verify root directory is "frontend"
3. Run locally: npm run build
4. Fix errors, push, retry
```

---

## Monitoring Logs

### View Backend Logs
```
Render Dashboard → Your service → Logs
Watch real-time logs of API calls and errors
```

### View Frontend Logs
```
Vercel Dashboard → Project → Deployments → Logs
Or check browser console (F12)
```

### Check Database
```
MongoDB Atlas → Browse Collections
View all users, resumes, and skill results
```

---

## Future Improvements

After deployment:
```
1. Set up custom domain (yourapp.com)
2. Upgrade to paid tier for better performance
3. Add SSL certificate (auto with Vercel/Render)
4. Set up monitoring/alerts
5. Add analytics
6. Implement email notifications
```

---

## Support

- Stuck? Check browser console (F12)
- Backend issues? Check Render/Railway logs
- Database issues? Check MongoDB Atlas logs
- Still stuck? Check DEPLOYMENT_GUIDE.md for detailed steps

---

## Summary

```
Time:       ~30-40 minutes
Cost:       FREE tier (or $5-10/month for better performance)
Difficulty: Easy
Result:     Production app accessible worldwide 🌍
```

**You're ready to deploy!** 🚀

```bash
# Make final commit
git add .
git commit -m "Production ready"
git push

# Then follow steps above to deploy!
```

