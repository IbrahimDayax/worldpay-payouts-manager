# 💳 Worldpay Access Account Payouts Management System

A production-ready, full-stack web application for managing international payouts through Worldpay's Access API. Built with Node.js, Express, React, and SQLite.

🚀 **Live Application:** [https://wp-payout.paysii.com](https://wp-payout.paysii.com)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Security](#-security)
- [License](#-license)

---

## 🎯 Overview

The Worldpay Access Account Payouts Management System is a secure, enterprise-grade application that enables businesses to manage international bank transfers efficiently.

### Key Capabilities

- Send international bank transfers to beneficiaries worldwide
- Track payout status in real-time through Worldpay's API
- Manage multiple users with role-based access control
- View comprehensive transaction history and analytics
- Generate detailed reports and audit trails

---

## ✨ Features

### Core Functionality

- ✅ **Payout Management:** Create and track payouts to beneficiaries in multiple currencies (USD, EUR, GBP)
- ✅ **Real-time Status Updates:** Sync payout status with Worldpay's payment network
- ✅ **Multi-Currency Support:** Handle cross-border payments with automatic currency conversion
- ✅ **Role-Based Access Control:** Separate permissions for Admin and Regular users

### Security Features

- 🔐 **JWT Authentication:** Secure token-based authentication system (8-hour expiry)
- 🔐 **Password Encryption:** bcrypt hashing with 10 salt rounds
- 🔐 **Rate Limiting:** Protection against brute force attacks (100 req/min)
- 🔐 **SQL Injection Prevention:** Parameterized database queries
- 🔐 **Security Headers:** Helmet.js implementation for HTTP security

### User Interface

- 🎨 **Modern Dashboard:** Clean interface with real-time statistics
- 🎨 **Responsive Design:** Mobile-friendly layout
- 🎨 **Advanced Filtering:** Search and filter payouts by status, date, or beneficiary

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | Node.js 18+, Express.js 4.19, SQLite 3.x |
| **Frontend** | React 18.3, Vite 5.4, Axios, Custom CSS |
| **Auth & Security** | JWT, bcrypt, Helmet, CORS, Express Rate Limit |
| **Infrastructure** | Nginx (Reverse Proxy), PM2 (Process Manager), Ubuntu 24.04 |
| **External API** | Worldpay Access API (v2025-01-01) |

---

## 🏗️ Architecture

The application follows a standard 3-tier architecture, utilizing a RESTful API to communicate between the React frontend and the Express backend.

### Request Flow

1. **User Action:** User initiates a payout via the React Dashboard
2. **API Call:** Frontend sends a secured POST request to the Express API
3. **Validation:** Backend validates the token and payload
4. **External Processing:** Backend communicates with Worldpay Access API
5. **Persistence:** Transaction details are stored in SQLite
6. **Response:** Status is returned to the user

---

## 📦 Prerequisites

Before installation, ensure you have:

- **Node.js:** Version 18.x or higher
- **Git:** For cloning the repository
- **Worldpay Access Account:**
  - Username & Password
  - Merchant Entity ID

---

## 🚀 Installation

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/worldpay-payouts.git
cd worldpay-payouts
```

#### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials (see Configuration section)
npm run seed  # Initializes DB and creates Admin user
npm run dev
```

#### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

#### 4. Access

Open [http://localhost:5173](http://localhost:5173)

**Default credentials:**
- Email: `admin@yourdomain.com`
- Password: *(As defined in your .env)*

---

## ⚙️ Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
# Server
PORT=4000
NODE_ENV=development
JWT_SECRET=CHANGE_THIS_TO_A_SECURE_STRING

# Database
DB_FILE=./data/app.db

# Initial Admin Setup
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
ADMIN_NAME=Super Admin

# Worldpay API
WORLDPAY_BASE_URL=https://try.access.worldpay.com
WORLDPAY_USERNAME=your_username
WORLDPAY_PASSWORD=your_password
WORLDPAY_MERCHANT_ENTITY=your_entity_id

# Frontend
FRONTEND_URL=http://localhost:5173
```

> **Note:** For production, change `WORLDPAY_BASE_URL` to `https://access.worldpay.com`

---

## 🔌 API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

### Payouts

#### Create Payout
```http
POST /api/payouts
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": "199.99",
  "currency": "USD",
  "beneficiaryName": "John Smith",
  "beneficiaryAccount": "123456789",
  "countryCode": "US"
}
```

#### Get History
```http
GET /api/payouts
```

#### Refresh Status
```http
POST /api/payouts/:id/refresh
```

---

## 🌐 Deployment

### Production Deployment (Linux/Nginx)

1. **Prepare Server:** Install Node.js 18, Nginx, and PM2

2. **Build Frontend:**
   ```bash
   cd client && npm run build
   ```

3. **Configure Backend:** Ensure `NODE_ENV=production` and update database paths

4. **Start with PM2:**
   ```bash
   pm2 start ./server/src/index.js --name "worldpay-backend"
   ```

5. **Nginx Configuration:** Set up Nginx as a reverse proxy to serve the static frontend files and proxy `/api` requests to `localhost:4000`

---

## 🔒 Security

This application implements several security layers suitable for financial applications:

- **Data Protection:** No plain-text passwords stored
- **API Security:** Rate limiting prevents abuse; CORS restricts access to trusted domains
- **Infrastructure:** Run behind Nginx with SSL (HTTPS) enabled
- **Maintenance:** Regularly rotate `JWT_SECRET` and API credentials

---

## 📄 License

Copyright © 2025 Ibrahim Dayax. All rights reserved.

This software and its source code are the property of Ibrahim Dayax. No part of this repository may be reproduced, distributed, or modified without explicit written permission from the author.

---

## 📞 Support

For support, please contact the development team or open an issue on the repository.

- **Live App:** [https://wp-payout.paysii.com](https://wp-payout.paysii.com)
- **Documentation:** [Worldpay Access API](https://developer.worldpay.com/docs/access-worldpay)

---

**Next Step:** Would you like me to generate a specific Nginx configuration file optimized for this React/Express structure?
