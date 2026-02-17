# Deployment Guide - Skill Gap Mapper

## Overview

Your application has 3 components:
- **Frontend**: React app (best on Vercel/Netlify)
- **Backend**: Node.js/Express server (better on Railway/Render/Heroku)
- **Database**: MongoDB (use MongoDB Atlas - cloud)

---

## Architecture Recommendation

```
┌─────────────────────────────────────────────┐
│         Vercel/Netlify (Frontend)           │
│  React app at: smartskills.com              │
├─────────────────────────────────────────────┤
         ↓ API calls (https)
┌─────────────────────────────────────────────┐
│      Railway/Render (Backend)               │
│  Express server at: api.smartskills.com     │
├─────────────────────────────────────────────┤
         ↓ MongoDB query
┌─────────────────────────────────────────────┐
│    MongoDB Atlas (Database - Cloud)         │
│  MongoDB at: mongodb+srv://...              │
└─────────────────────────────────────────────┘
```

---

# OPTION 1: Netlify (Frontend) + Railway (Backend) + MongoDB Atlas

## Best for: Quick, easy deployment with good performance

### Step 1: Set Up MongoDB Atlas (Cloud Database)

**1.1 Create Free Cluster**
```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Sign Up Free"
3. Create account
4. Create a new project
5. Click "Build a Database"
6. Select "M0 Free" tier
7. Choose region close to you
8. Click "Create Cluster"
```

**1.2 Create Database User**
```
1. In Atlas Dashboard, go to "Database Access"
2. Click "Add New Database User"
3. Username: skillgap_user
4. Password: Create strong password (copy it!)
5. Click "Add User"
```

**1.3 Add IP Whitelist**
```
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (0.0.0.0/0) for development
4. Click "Confirm"
```

**1.4 Get Connection String**
```
1. Go to "Databases" 
2. Click "Connect"
3. Choose "Connect your application"
4. Copy connection string
5. It looks like:
   mongodb+srv://skillgap_user:PASSWORD@cluster0.xxxxx.mongodb.net/skillgapmapper?retryWrites=true&w=majority
```

---

### Step 2: Deploy Backend on Railway

**2.1 Initialize Git Repository**
```bash
cd skill-gap-mapper
git init
git add .
git commit -m "Initial commit"
```

**2.2 Create GitHub Repository**
```
1. Go to: https://github.com/new
2. Repository name: skill-gap-mapper
3. Not public, can be private
4. Click "Create repository"
5. Follow instructions to push existing repo
```

```bash
git remote add origin https://github.com/YOUR_USERNAME/skill-gap-mapper.git
git branch -M main
git push -u origin main
```

**2.3 Deploy Backend on Railway**
```
1. Go to: https://railway.app
2. Click "Create Project"
3. Select "Deploy from GitHub"
4. Authorize GitHub
5. Select "skill-gap-mapper" repository
6. Railway auto-detects Node.js
7. Select "backend" as root directory
```

**2.4 Add Environment Variables on Railway**
```
1. Click "Variables" tab
2. Add these variables:
   
   PORT=5000
   MONGODB_URI=mongodb+srv://skillgap_user:PASSWORD@cluster0.xxxxx.mongodb.net/skillgapmapper
   JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars_12345
   OPENAI_API_KEY=sk-your-key-here (optional)
   NODE_ENV=production
   
3. Click "Save"
```

**2.5 Deploy**
```
Railway auto-deploys when you push to GitHub!
Your backend URL will be: https://projectname.up.railway.app
```

---

### Step 3: Deploy Frontend on Netlify

**3.1 Prepare Frontend for Production**

Update API URL in frontend:

```bash
# frontend/src/services/api.js
```

Change:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

**3.2 Create Netlify Config**

Create `frontend/netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[env.production]
  REACT_APP_API_URL = "https://yourbackend.up.railway.app/api"
```

**3.3 Deploy Frontend on Netlify**
```
1. Go to: https://netlify.com
2. Click "Connect to Git"
3. Select GitHub
4. Choose "skill-gap-mapper" repo
5. Base directory: frontend
6. Build command: npm run build
7. Publish directory: build
8. Click "Deploy site"
```

**3.4 Add Environment Variables**
```
1. Dashboard → Site Settings → Environment
2. Add variable:
   REACT_APP_API_URL=https://yourbackend.up.railway.app/api
3. Save and redeploy
```

---

# OPTION 2: Vercel (Frontend) + Render (Backend)

## Best for: Fastest, most seamless experience

### Step 1: MongoDB Atlas (Same as Option 1)
[Follow Step 1 above for MongoDB setup]

### Step 2: Deploy Backend on Render

**2.1 Push to GitHub**
[Same as Option 1, Step 2.1-2.2]

**2.2 Deploy on Render**
```
1. Go to: https://render.com
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub repository
5. Select "skill-gap-mapper"
6. Enter settings:
   - Name: skill-gap-mapper-backend
   - Environment: Node
   - Build Command: npm install
   - Start Command: npm run start (or node server.js)
   - Instance Type: Free
7. Click "Create Web Service"
```

**2.3 Add Environment Variables on Render**
```
1. Go to Service Settings
2. Add "Environment"
3. Add variables:
   PORT=5000
   MONGODB_URI=mongodb+srv://skillgap_user:PASSWORD@...
   JWT_SECRET=your_secret_key_here
   OPENAI_API_KEY=sk-...
   NODE_ENV=production
```

**2.4 Your Backend URL**
```
https://skill-gap-mapper-backend.onrender.com
```

### Step 3: Deploy Frontend on Vercel

**3.1 Update API URL**
```
frontend/src/services/api.js:
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

**3.2 Deploy on Vercel**
```
1. Go to: https://vercel.com
2. Click "New Project"
3. Select GitHub
4. Import repository
5. Select "skill-gap-mapper"
6. Framework: Next.js / React
7. Root Directory: frontend
8. Build Command: npm run build
9. Output Directory: build
10. Click "Deploy"
```

**3.3 Add Environment Variable**
```
1. Project Settings → Environment Variables
2. Add: REACT_APP_API_URL = https://skill-gap-mapper-backend.onrender.com/api
3. Redeploy
```

---

# OPTION 3: Heroku (Full Stack)

## Note: Heroku discontinued free tier (Nov 2022)
You'll need paid Heroku Dyno

---

# Production Checklist

## Backend (.env.production)
```bash
✓ MONGODB_URI - MongoDB Atlas connection string
✓ JWT_SECRET - 32+ character random string
✓ OPENAI_API_KEY - Valid OpenAI key (optional)
✓ NODE_ENV=production
✓ PORT=5000
✓ Client_URL - Your frontend domain
```

## Frontend (.env.production)
```bash
✓ REACT_APP_API_URL - Production backend URL
✓ REACT_APP_ENV=production
```

## MongoDB Atlas Security
```
✓ Strong database password
✓ IP whitelist (allow production server IPs)
✓ User with minimal permissions
✓ Enable encryption (free tier included)
✓ Enable automated backups
```

## CORS Configuration

Update `backend/server.js`:
```javascript
app.use(cors({ 
  origin: [
    'https://yourfrontend.netlify.app',
    'https://yourfrontend.vercel.app',
    'http://localhost:3000'
  ], 
  credentials: true 
}));
```

---

# Costs Breakdown

## Option 1: Netlify + Railway + MongoDB Atlas
- **MongoDB Atlas**: Free tier (~0.5GB)
- **Railway**: $5/month minimum (or free with credits)
- **Netlify**: Free tier (with paid options)
- **Total**: ~$5-10/month

## Option 2: Vercel + Render + MongoDB Atlas
- **MongoDB Atlas**: Free tier (~0.5GB)
- **Render**: Free tier (sleeps after inactivity)
- **Vercel**: Free tier (with paid add-ons)
- **Total**: Free (or ~$5-10/month for better performance)

---

# Step-by-Step Deployment (Option 2: Vercel + Render)

## 1. Prepare Code

```bash
# Make sure everything committed
git add .
git commit -m "Prepare for production"
git push origin main
```

## 2. Set Up MongoDB Atlas
- [Follow steps above]
- Get connection string: `mongodb+srv://user:pass@...`

## 3. Deploy Backend (Render)
```
1. Connect GitHub to Render
2. Create Web Service from repository
3. Set environment variables
4. Get backend URL: https://skill-gap-mapper-backend.onrender.com
```

## 4. Deploy Frontend (Vercel)
```
1. Connect GitHub to Vercel
2. Import skill-gap-mapper project
3. Root directory: frontend
4. Set REACT_APP_API_URL = (your backend URL from step 3)
5. Deploy
```

## 5. Update CORS
In `backend/server.js`, add your Vercel frontend URL to CORS whitelist

## 6. Test Production
```
1. Go to frontend URL (Vercel)
2. Register new account
3. Upload resume
4. Check skills are extracted
5. Analyze job
```

---

# Deployment Video Tutorial Links

**Vercel Frontend**: https://www.youtube.com/watch?v=ZjUzN0G0nw0
**Render Backend**: https://www.youtube.com/watch?v=sSIdU1XO7d0
**MongoDB Atlas Setup**: https://www.youtube.com/watch?v=rPqRyYJmUo0

---

# Troubleshooting

### Frontend shows "Cannot connect to API"
```
1. Check backend URL in frontend/.env
2. Check CORS settings in backend/server.js
3. Verify backend is running on Render
4. Check network tab in browser DevTools
```

### Server crashes on Render
```
1. Check logs: Render dashboard → Logs
2. Verify MONGODB_URI is correct
3. Check IP whitelist in MongoDB Atlas
4. Verify database user password has no special chars (or URL-encoded)
```

### Database connection timeout
```
1. Add your server IP to MongoDB Atlas whitelist
2. Use 0.0.0.0/0 for development
3. Check network connectivity
4. Verify MONGODB_URI format
```

### Resume upload fails
```
1. Check file size limit (10MB in backend)
2. Verify PDF has extractable text
3. Check backend logs for exact error
```

---

# My Recommendation

**Best Option**: Vercel (Frontend) + Render (Backend) + MongoDB Atlas

**Why:**
- ✅ Excellent developer experience
- ✅ Free tier for small projects
- ✅ Auto-deploy on git push
- ✅ Easy environment variables
- ✅ Good performance
- ✅ No credit card for free tier
- ✅ Easy to scale later

**Estimated Cost**: Free (or $5-10/month for better performance)

**Time to Deploy**: ~30 minutes

---

# Next Steps

1. **Get MongoDB Atlas running** (10 min)
2. **Push code to GitHub** (5 min)
3. **Deploy backend on Render** (10 min)
4. **Deploy frontend on Vercel** (5 min)
5. **Test in production** (5 min)

**Total: ~35 minutes to go live! 🚀**

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://www.mongodb.com/docs/atlas/
- **CORS Issues**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

