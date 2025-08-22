import axios from 'axios';
import { config } from './config.js';
import crypto from 'crypto';

const api = (config.worldpay.username && config.worldpay.password) ? axios.create({
  baseURL: config.worldpay.baseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'WP-Api-Version': '2025-01-01'
  }
}) : null;

// Generate correlation ID for tracking
function generateCorrelationId() {
  return crypto.randomUUID();
}

// Generate timestamp
function generateTimestamp() {
  return Math.floor(Date.now() / 1000).toString();
}

// Generate idempotency key
function generateIdempotencyKey() {
  return crypto.randomBytes(16).toString('hex');
}

export async function createPayout(payload) {
  if (!api) {
    // Mock mode - return fake successful response
    return {
      mock: true,
      id: 'mock_' + Math.random().toString(36).slice(2),
      status: 'submitted',
      transactionReference: payload.transactionReference || 'MOCK_REF',
      ...payload
    };
  }

  try {
    const correlationId = generateCorrelationId();
    const timestamp = generateTimestamp();
    const idempotencyKey = generateIdempotencyKey();

    // Create Basic Auth header
    const auth = Buffer.from(`${config.worldpay.username}:${config.worldpay.password}`).toString('base64');

    const requestHeaders = {
      'WP-CorrelationId': correlationId,
      'WP-Timestamp': timestamp,
      'Idempotency-Key': idempotencyKey,
      'Authorization': `Basic ${auth}`
    };

    // Convert your application's payout format to Worldpay format
    const worldpayPayload = {
      merchant: {
        entity: config.worldpay.merchantEntity || 'default'
      },
      instruction: {
        value: {
          sourceCurrency: payload.currency,
          sourceAmount: 0, // Let Worldpay calculate
          targetCurrency: payload.currency,
          targetAmount: payload.amount / 100 // Convert cents to currency units
        },
        narrative: {
          line1: payload.reference || 'Payout via Worldpay Access'
        },
        countryCode: payload.countryCode || 'GB',
        beneficiaryBankDetails: {
          // Handle different account types
          ...(payload.beneficiaryAccount.startsWith('GB') ? 
            { iban: payload.beneficiaryAccount } : 
            { accountNumber: payload.beneficiaryAccount }
          ),
          bankName: payload.beneficiaryBank || 'Bank'
        },
        parties: [
          {
            partyType: 'beneficiary',
            personalDetails: {
              type: 'Person', // or 'Company' based on your needs
              firstName: payload.beneficiaryName.split(' ')[0] || payload.beneficiaryName,
              lastName: payload.beneficiaryName.split(' ').slice(1).join(' ') || ''
            },
            address: {
              address1: payload.beneficiaryAddress?.address1 || 'Address Line 1',
              city: payload.beneficiaryAddress?.city || 'City',
              postalCode: payload.beneficiaryAddress?.postalCode || 'Postal Code',
              countryCode: payload.beneficiaryAddress?.countryCode || 'GB'
            }
          }
        ]
      },
      transactionReference: payload.transactionReference || `PAY_${Date.now()}`
    };

    console.log('Sending to Worldpay:', JSON.stringify(worldpayPayload, null, 2));

    const response = await api.post('/accountPayouts', worldpayPayload, {
      headers: requestHeaders
    });

    console.log('Worldpay response:', response.data);

    return {
      id: response.data.id || response.data.transactionReference,
      status: response.data.status || 'submitted',
      worldpayResponse: response.data,
      correlationId,
      timestamp
    };

  } catch (error) {
    console.error('Worldpay API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });

    // More specific error handling
    if (error.response?.status === 401) {
      throw new Error('Worldpay authentication failed - check credentials');
    } else if (error.response?.status === 400) {
      throw new Error(`Worldpay validation error: ${error.response.data?.message || 'Invalid request'}`);
    } else {
      throw new Error(`Worldpay API error: ${error.response?.data?.message || error.message}`);
    }
  }
}

export async function getPayoutStatus(payoutId) {
  if (!api) {
    return { 
      mock: true, 
      id: payoutId, 
      status: 'processed',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const correlationId = generateCorrelationId();
    const timestamp = generateTimestamp();
    const auth = Buffer.from(`${config.worldpay.username}:${config.worldpay.password}`).toString('base64');

    const response = await api.get(`/accountPayouts/${payoutId}`, {
      headers: {
        'WP-CorrelationId': correlationId,
        'WP-Timestamp': timestamp,
        'Authorization': `Basic ${auth}`
      }
    });

    return {
      id: payoutId,
      status: response.data.status,
      worldpayResponse: response.data,
      correlationId,
      timestamp
    };

  } catch (error) {
    console.error('Worldpay status check error:', error.response?.data || error.message);
    throw new Error('Failed to get payout status from Worldpay');
  }
}