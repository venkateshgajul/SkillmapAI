# Skill Gap Mapper - Setup & Run Instructions

## Prerequisites
✅ Node.js v22.16.0 - Already installed
✅ npm v10.9.2 - Already installed
✅ Docker & Docker Compose - Installed (but not running)
✅ Dependencies - Already installed

## Quick Start (3 Steps)

### Step 1: Start MongoDB Database

**Option A: Using Docker Desktop (Recommended)**
1. **Start Docker Desktop**:
   - Open Windows Start Menu
   - Search for "Docker Desktop"
   - Click to launch Docker Desktop
   - Wait 1-2 minutes for it to fully start (you'll see Docker icon in system tray)

2. **Start MongoDB with Docker Compose**:
   ```bash
   cd d:\SOURiK\Documents\skill-gap-mapper\skill-gap-mapper
   docker-compose up -d mongodb
   ```
   - This starts MongoDB on `mongodb://localhost:27017/skillgapmapper`

**Option B: Using MongoDB Atlas Cloud (No Installation)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/skillgapmapper`)
4. Update `.env` file in backend folder:
   ```
   MONGODB_URI=mongodb+srv://user:password@your-cluster.mongodb.net/skillgapmapper
   ```

---

### Step 2: Start Backend Server

Open **Terminal 1** and run:
```bash
cd d:\SOURiK\Documents\skill-gap-mapper\skill-gap-mapper\backend
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

---

### Step 3: Start Frontend Application

Open **Terminal 2** and run:
```bash
cd d:\SOURiK\Documents\skill-gap-mapper\skill-gap-mapper\frontend
npm start
```

Expected output:
```
Compiled successfully!
You can now view the app in the browser at:
  http://localhost:3000
```

---

## Access the Application

✅ **Frontend**: http://localhost:3000
✅ **Backend API**: http://localhost:5000/api
✅ **API Health Check**: http://localhost:5000/api/health

---

## Test Login

1. Open http://localhost:3000 in your browser
2. Click "Register" to create a new account
3. Fill in: Name, Email, Password
4. Click "Register"
5. You'll be logged in and redirected to the dashboard

---

## Troubleshooting

### ❌ "Cannot connect to MongoDB"
- Check if MongoDB is running: `docker ps` (should show MongoDB container)
- If using Docker, ensure Docker Desktop is running
- Check `.env` file has correct `MONGODB_URI`

### ❌ "Port 5000 already in use"
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### ❌ "Port 3000 already in use"
```bash
# Find process using port 3000
netstat -ano | findstr :3000
# Kill process
taskkill /PID <PID> /F
```

### ❌ "Cannot find module" error
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

### ❌ "ECONNREFUSED" when logging in
- Ensure backend is running (Terminal 1 should show "Server running on port 5000")
- Check network connectivity
- Verify API endpoint in frontend config: `src/services/api.js`

---

## Environment Configuration

**Backend .env** (`backend/.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillgapmapper
JWT_SECRET=anyrandomstringhere123
OPENAI_API_KEY=sk-your-key-here
NODE_ENV=development
```

**Frontend Connection**:
- Configured in `frontend/public/index.html` and `frontend/src/services/api.js`
- API URL: `http://localhost:5000/api`

---

## Stopping Services

### Stop Backend (Ctrl+C in Terminal 1)
```
^C (press Ctrl+C)
```

### Stop Frontend (Ctrl+C in Terminal 2)
```
^C (press Ctrl+C)
```

### Stop MongoDB
```bash
cd d:\SOURiK\Documents\skill-gap-mapper\skill-gap-mapper
docker-compose down
```

---

## Production Deployment

For Docker deployment:
```bash
cd d:\SOURiK\Documents\skill-gap-mapper\skill-gap-mapper
docker-compose up -d
```

This starts:
- MongoDB container
- Backend container
- Frontend container (Nginx)

---

## Features to Test

✅ Register new user
✅ Login with credentials
✅ Upload resume (if implemented)
✅ View skill analysis
✅ Update profile

---

**Questions?** Check logs in both terminals for error messages.
