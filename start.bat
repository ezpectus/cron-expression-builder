@echo off
chcp 65001 >nul 2>&1
title Cron Expression Builder - Dev Server

echo ============================================
echo   Cron Expression Builder v1.2.0
echo   Starting Development Server
echo ============================================
echo.

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js v20+ from https://nodejs.org/
    pause
    exit /b 1
)

:: Show Node version
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION%
echo.

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo [INFO] Installing dependencies (first run)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo.
)

echo [INFO] Starting Vite development server...
echo [INFO] Press Ctrl+C to stop the server.
echo.
call npm run dev
pause
