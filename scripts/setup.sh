#!/bin/bash

echo "🚀 Setting up Worldpay Access Payouts Application..."

# Backend setup
echo "📦 Setting up backend..."
cd server
cp .env.example .env
npm install
npm run seed

# Frontend setup
echo "🎨 Setting up frontend..."
cd ../client
npm install

echo "✅ Setup complete!"
echo "Run ./scripts/start.sh to start the application"
