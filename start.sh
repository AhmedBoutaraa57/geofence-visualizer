#!/bin/bash

# Start script for Geofence Visualization Tool
# This script starts both the backend server and frontend dev server

echo "Starting Geofence Visualization Tool..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "Installing server dependencies..."
    cd server
    npm install
    cd ..
fi

echo ""
echo "Starting backend server on port 3001..."
cd server
npm start &
SERVER_PID=$!
cd ..

# Wait a moment for server to start
sleep 2

echo "Starting frontend dev server on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo "Geofence Visualization Tool is running!"
echo "=========================================="
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
trap "kill $SERVER_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
