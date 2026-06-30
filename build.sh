#!/bin/bash
set -e

echo "============================================"
echo "  Cron Expression Builder v1.2.0"
echo "  Production Build"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH."
    echo "Please install Node.js v20+ from https://nodejs.org/"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    npm install
    echo ""
fi

echo "[INFO] Building production bundle..."
npm run build

echo ""
echo "============================================"
echo "  Build complete! Output in dist/"
echo "============================================"
echo ""
echo "To preview the build: npm run preview"
echo "To deploy: upload dist/ to Netlify or your host"
