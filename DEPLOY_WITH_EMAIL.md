# 🚀 DEPLOYMENT AUTOMATION - Using Your Email

Email: venkateshgajul783@gmail.com

## STEP 1: Create GitHub Account (2 min)

Go to: https://github.com/signup

Use your existing email: **venkateshgajul783@gmail.com**

Choose username: **venkateshgajul783** (or similar)

Password: Use something strong (different from other services)

Verify email.

---

## STEP 2: Create GitHub Personal Access Token

This is MORE SECURE than using password directly.

```
1. Go to: https://github.com/settings/tokens/new
2. Fill in:
   - Token name: skill-gap-mapper-deploy
   - Expiration: 90 days
   - Scopes: Check ALL boxes
3. Click "Generate token"
4. COPY the token that appears
5. SAVE IT SOMEWHERE SAFE
```

You'll get a token like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## STEP 3: Push Code to GitHub

Once you have the token, I'll run this command:

```bash
cd /d/SOURiK/Documents/skill-gap-mapper/skill-gap-mapper

git config user.email "venkateshgajul783@gmail.com"
git config user.name "Venkatesh Gajul"

git remote add origin https://ghp_YOUR_TOKEN@github.com/venkateshgajul783/skill-gap-mapper.git
git push -u origin main
```

---

## STEP 4: MongoDB Atlas Setup (3 min)

Go to: https://www.mongodb.com/cloud/atlas

Sign up with: **venkateshgajul783@gmail.com**

Follow:
```
1. Create organization
2. Create project
3. Create M0 Free cluster
4. Create user: skillgap_user / [strong password]
5. Get connection string
```

---

## STEP 5: Vercel Deployment (5 min)

Go to: https://vercel.com/signup

Sign up with GitHub

Select skill-gap-mapper repo

Add env: REACT_APP_API_URL = [backend url]

Deploy!

---

## STEP 6: Render Deployment (5 min)

Go to: https://render.com

Sign up with GitHub

Create Web Service from skill-gap-mapper

Add env variables (MONGODB_URI, JWT_SECRET, etc)

Deploy!

---

**Total: ~20 minutes**

---

**NEXT: Tell me when you have the GitHub Personal Access Token and I'll automate the push!**

