# AICA Local Development Setup Script (Windows)

Write-Host "[*] Setting up AICA for local development..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info > $null 2>&1
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Create .env files if they don't exist
if (!(Test-Path "backend\.env.local")) {
    Write-Host "[*] Creating backend\.env.local" -ForegroundColor Yellow
    Copy-Item "backend\.env.local.example" "backend\.env.local" -ErrorAction SilentlyContinue
}

if (!(Test-Path "frontend\.env.local")) {
    Write-Host "[*] Creating frontend\.env.local" -ForegroundColor Yellow
    Copy-Item "frontend\.env.local.example" "frontend\.env.local" -ErrorAction SilentlyContinue
}

# Start services
Write-Host "[*] Starting Docker Compose services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for postgres to be ready
Write-Host "[*] Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Run migrations
Write-Host "[*] Running database migrations..." -ForegroundColor Yellow
docker-compose exec -T backend pnpm prisma migrate deploy | Out-Null

Write-Host ""
Write-Host "[OK] Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "[INFO] Services running at:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:3000"
Write-Host "   Backend:   http://localhost:4000"
Write-Host "   Database:  localhost:5432"
Write-Host ""
Write-Host "[INFO] View logs:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f"
Write-Host ""
Write-Host "[INFO] To stop services:" -ForegroundColor Cyan
Write-Host "   docker-compose down"
