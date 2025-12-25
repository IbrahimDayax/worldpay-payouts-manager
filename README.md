💳 Worldpay Access Account Payouts Management System

A production-ready, full-stack web application for managing international payouts through Worldpay's Access API. Built with Node.js, Express, React, and SQLite.

🚀 Live Demo

The application is now live at: https://wp-payout.paysii.com

📋 Table of Contents

Overview

Features

Tech Stack

Architecture

Prerequisites

Installation

Configuration

API Documentation

Deployment

Security

License

🎯 Overview

The Worldpay Access Account Payouts Management System is a secure, enterprise-grade application that enables businesses to:

Send international bank transfers to beneficiaries worldwide.

Track payout status in real-time through Worldpay's API.

Manage multiple users with role-based access control.

View comprehensive transaction history and analytics.

✨ Features

Core Functionality

✅ Payout Management: Create and track payouts to beneficiaries in multiple currencies (USD, EUR, GBP).

✅ Real-time Status Updates: Sync payout status with Worldpay's payment network.

✅ Multi-Currency Support: Handle cross-border payments with automatic currency conversion.

✅ Role-Based Access Control: Separate permissions for Admin and Standard users.

Security

🔐 JWT Authentication: Secure token-based authentication system (8-hour expiry).

🔐 Password Encryption: bcrypt hashing with 10 salt rounds.

🔐 Rate Limiting: Protection against brute force attacks (100 req/min).

🔐 Input Validation: Parameterized database queries to prevent SQL injection.

User Interface

🎨 Modern Dashboard: Clean interface with real-time statistics.

🎨 Responsive Design: Mobile-friendly layout.

🎨 Advanced Filtering: Search payouts by status, date, or beneficiary.

🛠️ Tech Stack

Backend

Runtime: Node.js 18+

Framework: Express.js 4.19

Database: SQLite 3.x (Easy migration to PostgreSQL)

Security: Helmet, CORS, Express Rate Limit

Frontend

Framework: React 18.3

Build Tool: Vite 5.4

Styling: Custom CSS / Tailwind-ready

Infrastructure

Web Server: Nginx (Reverse proxy & SSL)

Process Manager: PM2

OS: Ubuntu 24.04 LTS

🏗️ Architecture

Request Flow:
Browser → Nginx → Express → Auth Middleware → Controller → Service → Worldpay API / Database

graph LR
    A[Client Browser] -->|HTTPS| B[Nginx Reverse Proxy]
    B -->|Proxy Pass| C[Express Backend :4000]
    C -->|Queries| D[(SQLite Database)]
    C -->|External API| E[Worldpay Access API]


📦 Prerequisites

Node.js: v18.x or higher

Worldpay Access Account:

Username & Password

Merchant Entity ID

🚀 Installation

1. Clone the Repository

git clone [https://github.com/yourusername/worldpay-payouts.git](https://github.com/yourusername/worldpay-payouts.git)
cd worldpay-payouts


2. Backend Setup

cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run seed  # Initialize DB and Admin user
npm run dev


3. Frontend Setup

cd ../client
npm install
npm run dev


Default Admin Credentials

Email: admin@yourdomain.com

Password: (Set in your .env file)

⚙️ Configuration

Create a .env file in the server directory:

# Server
PORT=4000
NODE_ENV=development
JWT_SECRET=change_this_to_a_secure_random_string
FRONTEND_URL=http://localhost:5173

# Database
DB_FILE=./data/app.db

# Admin Setup
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure_password_here
ADMIN_NAME=Super Admin

# Worldpay API
WORLDPAY_BASE_URL=[https://try.access.worldpay.com](https://try.access.worldpay.com)
WORLDPAY_USERNAME=your_username
WORLDPAY_PASSWORD=your_password
WORLDPAY_MERCHANT_ENTITY=your_entity_id


🔌 API Documentation

Auth

POST /api/auth/login: Authenticate user and receive JWT.

GET /api/auth/me: Get current user details.

Payouts

POST /api/payouts: Create a new payout.

GET /api/payouts: List all payouts.

POST /api/payouts/:id/refresh: Force sync status with Worldpay.

Users (Admin)

GET /api/users: List all users.

POST /api/users: Create a new user.

DELETE /api/users/:id: Delete a user.

🌐 Deployment

This application is optimized for deployment on Linux (Ubuntu) using Nginx and PM2.

1. Build Frontend

cd client
npm run build


2. Configure PM2 (Backend)

cd server
pm2 start src/index.js --name "worldpay-backend"
pm2 save


3. Configure Nginx

Use the following block in your Nginx config (/etc/nginx/sites-available/default) to proxy requests and serve the React build.

server {
    listen 80;
    server_name wp-payout.paysii.com;

    root /var/www/worldpay-payouts/client/dist;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}


🔒 Security

HTTPS: Always use SSL/TLS (Let's Encrypt recommended) in production.

Environment Variables: Never commit .env files to version control.

Rate Limiting: Configured to prevent abuse.

Headers: Helmet.js is used to set secure HTTP headers.

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
