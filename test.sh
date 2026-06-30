#!/bin/bash
set -e

echo "============================================"
echo "  Cron Expression Builder v1.2.0"
echo "  Quality Gates"
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

echo "[1/3] Running tests..."
echo "--------------------------------------------"
npx vitest run
echo ""

echo "[2/3] Running ESLint..."
echo "--------------------------------------------"
npx eslint src/ --ext .js,.jsx
echo ""

echo "[3/3] Running production build..."
echo "--------------------------------------------"
npx vite build

echo ""
echo "============================================"
echo "  All quality gates passed!"
echo "============================================"
