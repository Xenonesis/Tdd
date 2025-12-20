# Test Supabase Connection
Write-Host "Testing Supabase PostgreSQL Connection" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load environment variables
$envPath = "backend/.env"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^DIRECT_URL=(.+)$') {
            $directUrl = $matches[1].Trim('"')
            Write-Host "Found DIRECT_URL in .env" -ForegroundColor Green
            Write-Host "Connection string (password hidden):" -ForegroundColor Yellow
            $hiddenUrl = $directUrl -replace ':[^@]+@', ':****@'
            Write-Host "  $hiddenUrl" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "❌ backend/.env file not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Attempting connection test via Prisma..." -ForegroundColor Yellow
Write-Host ""

# Try to connect using Prisma
cd backend
$result = npx prisma db execute --stdin <<< "SELECT 1;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Connection successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Connection failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. Password is incorrect or not properly encoded" -ForegroundColor White
    Write-Host "  2. IP address not whitelisted (check Supabase Dashboard → Settings → Database)" -ForegroundColor White
    Write-Host "  3. Database is paused (check Supabase project status)" -ForegroundColor White
    Write-Host ""
    Write-Host "Suggested fixes:" -ForegroundColor Magenta
    Write-Host "  1. Copy the connection string directly from Supabase (use the copy button)" -ForegroundColor White
    Write-Host "  2. Reset your database password to something without special characters" -ForegroundColor White
    Write-Host "  3. Verify your Supabase project is active" -ForegroundColor White
}
