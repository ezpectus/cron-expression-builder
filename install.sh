#!/bin/bash
set -e

echo "============================================"
echo "  Cron Expression Builder v1.2.0"
echo "  Installing Dependencies"
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

echo "[INFO] Running npm install..."
npm install

echo ""
echo "============================================"
echo "  Installation complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo "  - Run ./start.sh to start the dev server"
echo "  - Run ./build.sh to create a production build"
echo "  - Run ./test.sh to run the test suite"
