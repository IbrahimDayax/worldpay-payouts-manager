import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  jwtSecret: process.env.JWT_SECRET || 'change_me_in_production',
  worldpay: {
    baseUrl: process.env.WORLDPAY_BASE_URL || 'https://try.access.worldpay.com',
    serviceKey: process.env.WORLDPAY_SERVICE_KEY || '',
    merchantId: process.env.WORLDPAY_MERCHANT_ID || ''
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    name: process.env.ADMIN_NAME || 'Super Admin'
  }
};
