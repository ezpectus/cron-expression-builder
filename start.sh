#!/bin/bash
set -e

echo "============================================"
echo "  Cron Expression Builder v1.2.0"
echo "  Starting Development Server"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH."
    echo "Please install Node.js v20+ from https://nodejs.org/"
    exit 1
fi

# Show Node version
echo "Node.js version: $(node -v)"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies (first run)..."
    npm install
    echo ""
fi

echo "[INFO] Starting Vite development server..."
echo "[INFO] Press Ctrl+C to stop the server."
echo ""
npm run dev
