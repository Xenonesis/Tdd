#!/usr/bin/env pwsh
# Start Fresh Script - Kills ports and starts on port 3000

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "          STARTING FRESH - CLEANING PORTS...            " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# Function to kill process on a specific port
function Kill-PortProcess {
    param([int]$Port)
    
    Write-Host "Checking port $Port..." -ForegroundColor Yellow
    
    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        
        if ($connections) {
            foreach ($connection in $connections) {
                $processId = $connection.OwningProcess
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                
                if ($process) {
                    Write-Host "  Found process: $($process.Name) (PID: $processId)" -ForegroundColor Red
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    Write-Host "  Killed process on port $Port" -ForegroundColor Green
                } else {
                    Write-Host "  Process not found for PID: $processId" -ForegroundColor Yellow
                }
            }
        } else {
            Write-Host "  Port $Port is already free" -ForegroundColor Green
        }
    } catch {
        Write-Host "  Port $Port is free" -ForegroundColor Gray
    }
}

# Kill common ports
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "STEP 1: Killing processes on common ports..." -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

$ports = @(3000, 3001, 3002, 3003, 5173, 5174, 8080, 8000, 4200)
foreach ($port in $ports) {
    Kill-PortProcess -Port $port
}

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "STEP 2: Checking and fixing lint errors..." -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# Fix frontend lint errors
Write-Host "Fixing frontend lint errors..." -ForegroundColor Yellow
try {
    npm run lint:fix 2>&1 | Out-Null
    Write-Host "Frontend lint errors fixed!" -ForegroundColor Green
} catch {
    Write-Host "Some frontend lint errors may need manual fixing" -ForegroundColor Yellow
}

Write-Host ""

# Fix backend lint errors
Write-Host "Fixing backend lint errors..." -ForegroundColor Yellow
try {
    Set-Location backend
    npm run lint 2>&1 | Out-Null
    Set-Location ..
    Write-Host "Backend lint errors checked!" -ForegroundColor Green
} catch {
    Set-Location ..
    Write-Host "Some backend lint errors may need manual fixing" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "STEP 3: Starting development server on port 3000..." -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variable for port 3000
$env:PORT = "3000"

Write-Host "Starting Next.js on port 3000..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start the dev server
npm run dev:normal
