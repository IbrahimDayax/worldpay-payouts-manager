import axios from 'axios';
import { config } from './config.js';

const api = config.worldpay.serviceKey ? axios.create({
  baseURL: config.worldpay.baseUrl,
  timeout: 15000,
  headers: {
    'Authorization': `Bearer ${config.worldpay.serviceKey}`,
    'Content-Type': 'application/json'
  }
}) : null;

export async function createPayout(payload) {
  if (!api) {
    return {
      mock: true,
      id: 'mock_' + Math.random().toString(36).slice(2),
      status: 'submitted',
      ...payload
    };
  }

  try {
    const response = await api.post('/account-payouts/v1/payouts', {
      merchantId: config.worldpay.merchantId,
      ...payload
    });
    return response.data;
  } catch (error) {
    console.error('Worldpay error:', error.response?.data || error.message);
    throw new Error('Worldpay API error');
  }
}

export async function getPayoutStatus(payoutId) {
  if (!api) {
    return { mock: true, id: payoutId, status: 'processed' };
  }

  try {
    const response = await api.get(`/account-payouts/v1/payouts/${payoutId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to get payout status');
  }
}
