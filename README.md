# SkillMap AI — Dynamic Skill-Gap Mapper

> AI-powered platform that analyzes student resumes and identifies missing skills for a target job role.

![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB%20%7C%20OpenAI-B5FF4D?style=flat-square&labelColor=0D1526)

---

## Architecture

```
skill-gap-mapper/
├── backend/
│   ├── routes/          # Express route definitions
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic (OpenAI, PDF, analysis)
│   ├── models/          # Mongoose schemas
│   ├── utils/           # Middleware, job map
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-level pages
│   │   ├── services/    # API client layer
│   │   └── store/       # Auth context
│   └── public/
└── docker-compose.yml
```

---

## Quick Start

### Prerequisites
- ✅ Node.js 18+ (v22.16.0 recommended)
- ✅ MongoDB (via Docker or Atlas Cloud)
- OpenAI API Key (optional for now)

### Fastest Method (Windows)

**Option 1: Using Batch Script**
1. Ensure Docker Desktop is running
2. Double-click: `start.bat`
3. Done! Services will open in new terminals

**Option 2: Using PowerShell**
```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

**Option 3: Manual Setup (5 minutes)**

#### Step 1: Start MongoDB
```bash
# Terminal 1
cd skill-gap-mapper
docker-compose up -d mongodb
```

#### Step 2: Start Backend
```bash
# Terminal 2
cd backend
npm install
npm run dev
```

#### Step 3: Start Frontend
```bash
# Terminal 3
cd frontend
npm install
npm start
```

**Services will be available at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed troubleshooting.

---

## Environment Variables

```env
# backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillgapmapper
JWT_SECRET=your_secure_secret_here
OPENAI_API_KEY=sk-...
NODE_ENV=development
```

---

## Docker Deployment

```bash
cp backend/.env.example backend/.env
# Set OPENAI_API_KEY in .env

docker-compose up -d
```

Access: `http://localhost:3000`

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/upload-resume` | Upload PDF resume |
| GET | `/api/resume` | List resumes (auth) |

### Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analysis/jobs` | Get preset job list |
| POST | `/api/analysis/analyze-job` | Run skill gap analysis |
| GET | `/api/analysis/history` | Analysis history (auth) |
| GET | `/api/analysis/progress` | Progress over time (auth) |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get full profile |
| POST | `/api/profile/course/complete` | Mark course done |
| POST | `/api/profile/course/remove` | Unmark course |

### Admin (future)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/analytics` | Platform analytics |
| GET | `/api/admin/export-csv` | Export results CSV |

---

## Core Modules

### 1. Resume Processing
- PDF upload via `multer` (memory storage, 10MB limit)
- Text extraction via `pdf-parse`
- Text cleaning (special chars, whitespace normalization)
- Section detection (experience, skills, education)

### 2. Skill Extraction
- OpenAI GPT-4o-mini analysis
- Strict JSON response enforcement
- Fallback to empty array on failure

### 3. Job Requirement Analyzer
- 12 preset job roles with curated skill lists
- Custom job title → AI-generated requirements
- Static fallback for non-OpenAI environments

### 4. Skill Gap Analysis
- Fuzzy matching for skill comparison
- Calculates: `(matched / required) × 100`
- Returns structured JSON result

### 5. Recommendation Engine
- AI-generated or static course/project recommendations
- Mapped to missing skills

### 6. Dashboard
- 3-step wizard: Upload → Select Role → Results
- Radial gauge for match percentage
- Interactive course completion tracking
- Works without auth (temporary mode)

### 7. User Profile
- JWT authentication (7-day expiry)
- Analysis history
- Progress chart over time
- Completed courses tracking

### 8. Admin (Future-Ready)
- `role: "user" | "admin"` in User model
- Analytics endpoint
- CSV export endpoint

---

## Database Schema

```
Users: { name, email, password, role, completedCourses }
Resumes: { userId, fileName, extractedText, extractedSkills }
SkillResults: { userId, resumeId, jobTitle, currentSkills, missingSkills, skillMatchPercentage, recommendedCourses, recommendedProjects }
ProgressLogs: { userId, jobTitle, skillMatchPercentage, skillResultId }
```

---

## Preset Job Roles
Backend Developer · Frontend Developer · Full Stack Developer · Data Scientist · Machine Learning Engineer · DevOps Engineer · Cloud Architect · Mobile Developer · Cybersecurity Analyst · Product Manager · UI/UX Designer · Data Engineer

---

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, Recharts, React Router, React Dropzone
- **Backend**: Node.js, Express, pdf-parse, OpenAI SDK, JWT, bcryptjs, multer
- **Database**: MongoDB, Mongoose
- **Deploy**: Docker, Nginx

---

## Hackathon Demo Flow

1. Register or use guest mode
2. Upload any PDF resume
3. Select "Backend Developer" or type custom role
4. View instant AI analysis with skill match %
5. Check recommended courses & projects
6. View profile for progress tracking
