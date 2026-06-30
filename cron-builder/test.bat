@echo off
chcp 65001 >nul 2>&1
title Cron Expression Builder - Tests & Lint

echo ============================================
echo   Cron Expression Builder v1.2.0
echo   Quality Gates
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

echo [1/3] Running tests...
echo --------------------------------------------
call npx vitest run
if %errorlevel% neq 0 (
    echo [ERROR] Tests failed.
    pause
    exit /b 1
)
echo.

echo [2/3] Running ESLint...
echo --------------------------------------------
call npx eslint src/ --ext .js,.jsx
if %errorlevel% neq 0 (
    echo [ERROR] Linting failed.
    pause
    exit /b 1
)
echo.

echo [3/3] Running production build...
echo --------------------------------------------
call npx vite build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   All quality gates passed!
echo ============================================
echo.
pause
