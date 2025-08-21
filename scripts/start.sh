#!/bin/bash

echo "🚀 Starting Worldpay Access Payouts Application..."

# Start backend
echo "📦 Starting backend server..."
cd server && npm run dev &

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd client && npm run dev &

echo "✅ Application started!"
echo "Backend: http://localhost:4000"
echo "Frontend: http://localhost:5173"

# Wait for processes
wait
