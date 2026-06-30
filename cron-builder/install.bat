@echo off
chcp 65001 >nul 2>&1
title Cron Expression Builder - Install Dependencies

echo ============================================
echo   Cron Expression Builder v1.2.0
echo   Installing Dependencies
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

echo [INFO] Running npm install...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Installation complete!
echo ============================================
echo.
echo Next steps:
echo   - Run start.bat to start the dev server
echo   - Run build.bat to create a production build
echo   - Run test.bat to run the test suite
echo.
pause
