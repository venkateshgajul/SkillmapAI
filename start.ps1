# Skill Gap Mapper - Quick Start Script (PowerShell)
# Run with: powershell -ExecutionPolicy Bypass -File start.ps1

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "    Skill Gap Mapper - Quick Start" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "❌ Docker Desktop is NOT running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start Docker Desktop:" -ForegroundColor Yellow
    Write-Host "  1. Open Windows Start Menu"
    Write-Host "  2. Search for 'Docker Desktop'"
    Write-Host "  3. Click to launch"
    Write-Host "  4. Wait 1-2 minutes for it to start"
    Write-Host "  5. Run this script again"
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

# Navigate to project directory
Set-Location "d:\SOURiK\Documents\skill-gap-mapper\skill-gap-mapper"

# Start MongoDB
Write-Host "Starting MongoDB..." -ForegroundColor Yellow
docker-compose up -d mongodb
Write-Host "✅ MongoDB started" -ForegroundColor Green
Write-Host ""

# Wait for MongoDB to be ready
Write-Host "Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Open Backend terminal
Write-Host "Opening Backend terminal..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\SOURiK\Documents\skill-gap-mapper\skill-gap-mapper\backend'; npm run dev"

Start-Sleep -Seconds 3

# Open Frontend terminal
Write-Host "Opening Frontend terminal..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\SOURiK\Documents\skill-gap-mapper\skill-gap-mapper\frontend'; npm start"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "    ✅ All services are starting!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "MongoDB:  mongodb://localhost:27017" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait 30-60 seconds for all services to fully start." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
