@echo off
chcp 65001 >nul 2>&1
title Cron Expression Builder - Production Build

echo ============================================
echo   Cron Expression Builder v1.2.0
echo   Production Build
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

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo.
)

echo [INFO] Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Build complete! Output in dist/
echo ============================================
echo.
echo To preview the build: npm run preview
echo To deploy: upload dist/ to Netlify or your host
echo.
pause
