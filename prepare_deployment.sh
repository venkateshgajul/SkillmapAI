#!/bin/bash
# Quick Production Deployment Setup Script

echo "=========================================="
echo "Skill Gap Mapper - Production Setup"
echo "=========================================="
echo ""

# Check Git
echo "1. Checking Git setup..."
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ Not a git repository"
  echo "   Run: git init && git add . && git commit -m 'Initial commit'"
  exit 1
fi
echo "✓ Git repository found"

# Check Node version
echo ""
echo "2. Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "✓ Node.js $NODE_VERSION"

# Check npm scripts
echo ""
echo "3. Verifying npm scripts..."
grep -q '"build"' frontend/package.json && echo "✓ Frontend build script found" || echo "⚠ No frontend build script"
grep -q '"start"' backend/package.json && echo "✓ Backend start script found" || echo "⚠ No backend start script"

# Check environment files
echo ""
echo "4. Checking environment files..."
[ -f "backend/.env" ] && echo "✓ Backend .env found" || echo "⚠ Backend .env missing"
[ -f "frontend/.env" ] && echo "✓ Frontend .env found" || echo "⚠ Frontend .env missing (can be optional)"

# Check Docker files
echo ""
echo "5. Checking Docker support..."
[ -f "backend/Dockerfile" ] && echo "✓ Backend Dockerfile found" || echo "⚠ Backend Dockerfile missing"
[ -f "frontend/Dockerfile" ] && echo "✓ Frontend Dockerfile found" || echo "⚠ Frontend Dockerfile missing"

echo ""
echo "=========================================="
echo "Setup Summary"
echo "=========================================="
echo ""
echo "Before deploying, ensure:"
echo "✓ Code committed to GitHub"
echo "✓ MongoDB Atlas cluster created"
echo "✓ Environment variables set in platform"
echo "✓ CORS updated with production domain"
echo ""
echo "Deploy Frontend:"
echo "  Platform: Vercel or Netlify"
echo "  Branch: main"
echo "  Directory: frontend"
echo ""
echo "Deploy Backend:"
echo "  Platform: Render or Railway"
echo "  Branch: main"
echo "  Directory: backend"
echo ""
echo "Ready to deploy! 🚀"
