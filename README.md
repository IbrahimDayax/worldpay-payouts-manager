# Worldpay Access Account Payouts Application

Full-stack application for managing account payouts through Worldpay Access API.

## 🚀 Features

- **Authentication**: JWT-based secure authentication
- **User Management**: Admin and user roles with different permissions
- **Payout Management**: Create and track payouts through Worldpay
- **Mock Mode**: Works without Worldpay credentials for testing
- **Modern UI**: Responsive React frontend with dark theme
- **Secure API**: Rate limiting, CORS, and security headers

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🛠️ Quick Setup

### Using the setup script:

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Manual setup:

1. **Backend Setup:**
   ```bash
   cd server
   cp .env.example .env
   npm install
   npm run seed
   npm run dev
   ```

2. **Frontend Setup:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🌍 Environment Configuration

### Backend (.env)

```env
PORT=4000
JWT_SECRET=your_secret_key_here
WORLDPAY_BASE_URL=https://try.access.worldpay.com
WORLDPAY_SERVICE_KEY=your_service_key
WORLDPAY_MERCHANT_ID=your_merchant_id
```

## 📁 Project Structure

```
.
├── server/              # Backend API
│   ├── src/            # Source code
│   ├── data/           # SQLite database
│   └── package.json
├── client/             # Frontend React app
│   ├── src/           # Source code
│   └── package.json
└── scripts/           # Utility scripts
```

## 🚢 Deployment

### Using Docker:

```bash
docker-compose up
```

### Manual Deployment:

1. Build frontend: `cd client && npm run build`
2. Set production environment variables
3. Run: `cd server && NODE_ENV=production npm start`

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `DELETE /api/users/:id` - Delete user

### Payouts
- `GET /api/payouts` - List payouts
- `POST /api/payouts` - Create payout
- `POST /api/payouts/:id/refresh` - Refresh status

## 🧪 Testing

The application works in mock mode when Worldpay credentials are not configured.

## 📄 License

MIT
