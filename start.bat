@echo off
REM Skill Gap Mapper - Quick Start Script for Windows
REM This script starts MongoDB, Backend, and Frontend

echo ============================================
echo    Skill Gap Mapper - Quick Start
echo ============================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Docker Desktop is NOT running!
    echo.
    echo Please start Docker Desktop:
    echo   1. Open Windows Start Menu
    echo   2. Search for "Docker Desktop"
    echo   3. Click to launch
    echo   4. Wait 1-2 minutes for it to start
    echo   5. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Docker is running
echo.

REM Change to project directory
cd /d "d:\SOURiK\Documents\skill-gap-mapper\skill-gap-mapper"

REM Start MongoDB
echo Starting MongoDB...
docker-compose up -d mongodb
echo ✅ MongoDB started
echo.

REM Wait for MongoDB to be ready
timeout /t 5 /nobreak

REM Create two terminal windows for Backend and Frontend
echo Opening Backend terminal...
start cmd /k "cd /d 'd:\SOURiK\Documents\skill-gap-mapper\skill-gap-mapper\backend' && npm run dev"

timeout /t 3 /nobreak

echo Opening Frontend terminal...
start cmd /k "cd /d 'd:\SOURiK\Documents\skill-gap-mapper\skill-gap-mapper\frontend' && npm start"

echo.
echo ============================================
echo    ✅ All services are starting!
echo ============================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo MongoDB:  mongodb://localhost:27017
echo.
echo Wait 30-60 seconds for all services to fully start.
echo.
pause
