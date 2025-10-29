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

// Generate correlation ID (GUID/UUID format)
function generateCorrelationId() {
  return crypto.randomUUID();
}

// Generate timestamp (Unix timestamp in seconds as STRING)
function generateTimestamp() {
  return Math.floor(Date.now() / 1000).toString();
}

// Generate idempotency key (1-35 characters)
function generateIdempotencyKey() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 15);
}

export async function createPayout(payload) {
  if (!api) {
    console.log('🔴 Running in MOCK mode - no real Worldpay connection');
    return {
      mock: true,
      payoutRequestId: 'MOCK_' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      status: 'submitted',
      transactionReference: payload.transactionReference || 'MOCK_REF'
    };
  }

  try {
    const correlationId = generateCorrelationId();
    const timestamp = generateTimestamp();
    const idempotencyKey = generateIdempotencyKey();

    // Create Basic Auth header
    const auth = Buffer.from(`${config.worldpay.username}:${config.worldpay.password}`).toString('base64');

    const requestHeaders = {
      'Authorization': `Basic ${auth}`,
      'WP-CorrelationId': correlationId,
      'WP-Timestamp': timestamp,
      'WP-Api-Version': '2025-01-01',
      'Idempotency-Key': idempotencyKey,
      'Content-Type': 'application/json'
    };

    // Determine if using IBAN or account number
    const isIBAN = payload.beneficiaryAccount && payload.beneficiaryAccount.match(/^[A-Z]{2}[0-9]{2}/);
    
    // Build beneficiary bank details based on account type
    const beneficiaryBankDetails = isIBAN ? {
      iban: payload.beneficiaryAccount,
      bankName: payload.beneficiaryBank || 'Bank'
    } : {
      accountType: payload.accountType || 'checking',
      accountNumber: payload.beneficiaryAccount,
      bankCode: payload.routingNumber,
      bankName: payload.beneficiaryBank || 'Bank'
    };

    // Build payload EXACTLY per Worldpay API spec
    const worldpayPayload = {
      merchant: {
        entity: config.worldpay.merchantEntity || 'BEESO'
      },
      instruction: {
        value: {
          sourceCurrency: payload.sourceCurrency || payload.currency || 'USD',
          sourceAmount: 0,
          targetCurrency: payload.targetCurrency || payload.currency || 'USD',
          targetAmount: parseFloat((payload.amount / 100).toFixed(2))
        },
        narrative: {
          line1: (payload.reference && payload.reference.length >= 6) 
            ? payload.reference.substring(0, 50)
            : 'Payout via Worldpay Access'
        },
        countryCode: payload.countryCode || 'US',
        beneficiaryBankDetails: beneficiaryBankDetails,
        parties: [
          {
            partyType: 'beneficiary',
            personalDetails: {
              type: payload.beneficiaryType || 'Person',
              ...(payload.beneficiaryType === 'Company' 
                ? { companyName: payload.beneficiaryName }
                : { 
                    title: payload.beneficiaryTitle || 'mr',
                    firstName: payload.beneficiaryName.split(' ')[0] || payload.beneficiaryName,
                    lastName: payload.beneficiaryName.split(' ').slice(1).join(' ') || 'N/A'
                  }
              )
            },
            address: payload.beneficiaryAddress || {
              address1: '4900 W Brown Deer Road',
              city: 'Milwaukee',
              state: 'WI',
              postalCode: '53223',
              countryCode: 'US'
            }
          }
        ]
      },
      transactionReference: payload.transactionReference || `PAY_${Date.now()}`
    };

    console.log('📤 Sending to Worldpay:');
    console.log(JSON.stringify(worldpayPayload, null, 2));
    console.log('📋 Headers:', {
      'WP-CorrelationId': correlationId,
      'WP-Timestamp': timestamp,
      'Idempotency-Key': idempotencyKey
    });

    const response = await api.post('/accountPayouts', worldpayPayload, {
      headers: requestHeaders
    });

    console.log('✅ Worldpay response:', response.data);

    return {
      payoutRequestId: response.data.payoutRequestId,
      idempotencyKey: response.data.idempotencyKey,
      entity: response.data.entity,
      status: 'submitted',
      worldpayResponse: response.data,
      correlationId,
      timestamp
    };

  } catch (error) {
    console.error('❌ Worldpay API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      throw new Error('Worldpay authentication failed - check username/password');
    } else if (error.response?.status === 400) {
      const validationErrors = error.response.data?.validationErrors || [];
      const errorDetails = validationErrors.map(e => 
        `${e.jsonPath}: ${e.message}`
      ).join(', ');
      throw new Error(`Worldpay validation error: ${errorDetails || error.response.data?.message || 'Invalid request'}`);
    } else if (error.response?.status === 403) {
      throw new Error('Access forbidden - check your entity permissions');
    } else if (error.response?.status === 500) {
      throw new Error('Worldpay server error - please try again');
    } else {
      throw new Error(`Worldpay error: ${error.response?.data?.message || error.message}`);
    }
  }
}

export async function getPayoutStatus(payoutRequestId) {
  if (!api) {
    return { 
      mock: true, 
      payoutRequestId: payoutRequestId, 
      status: 'processed'
    };
  }

  try {
    const correlationId = generateCorrelationId();
    const timestamp = generateTimestamp();
    const auth = Buffer.from(`${config.worldpay.username}:${config.worldpay.password}`).toString('base64');

    const response = await api.get(`/accountPayouts/${payoutRequestId}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'WP-CorrelationId': correlationId,
        'WP-Timestamp': timestamp,
        'WP-Api-Version': '2025-01-01'
      }
    });

    console.log('✅ Payout status response:', response.data);

    return {
      payoutRequestId: payoutRequestId,
      status: response.data.outcome?.status || 'unknown',
      worldpayResponse: response.data,
      correlationId,
      timestamp
    };

  } catch (error) {
    console.error('❌ Status check error:', error.response?.data || error.message);
    throw new Error('Failed to get payout status');
  }
}