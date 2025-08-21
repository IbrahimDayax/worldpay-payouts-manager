import express from 'express';
import db from './db.js';
import { requireAuth } from './auth.js';
import { createPayout, getPayoutStatus } from './worldpay.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';

    const payouts = await new Promise((resolve, reject) => {
      if (isAdmin) {
        db.all(
          `SELECT p.*, u.email as user_email, u.name as user_name 
           FROM payouts p 
           LEFT JOIN users u ON p.user_id = u.id 
           ORDER BY p.created_at DESC`,
          [],
          (err, rows) => err ? reject(err) : resolve(rows)
        );
      } else {
        db.all(
          'SELECT * FROM payouts WHERE user_id = ? ORDER BY created_at DESC',
          [req.user.id],
          (err, rows) => err ? reject(err) : resolve(rows)
        );
      }
    });

    res.json(payouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve payouts' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { amount, currency, beneficiaryName, beneficiaryAccount, beneficiaryBank, reference } = req.body;

    if (!amount || !currency || !beneficiaryName || !beneficiaryAccount) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const amountCents = Math.round(Number(amount) * 100);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const payoutId = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO payouts (user_id, amount_cents, currency, beneficiary_name,
         beneficiary_account, beneficiary_bank, reference, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [req.user.id, amountCents, currency.toUpperCase(), beneficiaryName,
         beneficiaryAccount, beneficiaryBank, reference],
        function(err) {
          err ? reject(err) : resolve(this.lastID);
        }
      );
    });

    const worldpayPayload = {
      amount: { value: amountCents, currencyCode: currency.toUpperCase() },
      beneficiary: {
        name: beneficiaryName,
        accountIdentifier: beneficiaryAccount,
        bankName: beneficiaryBank
      },
      reference: reference || `PAYOUT-${payoutId}`
    };

    let worldpayResponse;
    try {
      worldpayResponse = await createPayout(worldpayPayload);

      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE payouts SET status = ?, worldpay_id = ?, worldpay_response = ? WHERE id = ?`,
          [worldpayResponse.status || 'submitted', worldpayResponse.id, JSON.stringify(worldpayResponse), payoutId],
          err => err ? reject(err) : resolve()
        );
      });
    } catch (wpError) {
      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE payouts SET status = 'failed' WHERE id = ?`,
          [payoutId],
          err => err ? reject(err) : resolve()
        );
      });
      throw wpError;
    }

    const payout = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM payouts WHERE id = ?', [payoutId], (err, row) => {
        err ? reject(err) : resolve(row);
      });
    });

    res.status(201).json({ payout, worldpay: worldpayResponse });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to create payout' });
  }
});

router.post('/:id/refresh', requireAuth, async (req, res) => {
  try {
    const payoutId = parseInt(req.params.id, 10);

    const payout = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM payouts WHERE id = ?', [payoutId], (err, row) => {
        err ? reject(err) : resolve(row);
      });
    });

    if (!payout) {
      return res.status(404).json({ error: 'Payout not found' });
    }

    if (req.user.role !== 'admin' && payout.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const worldpayId = payout.worldpay_id || `local-${payout.id}`;
    const statusResponse = await getPayoutStatus(worldpayId);

    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE payouts SET status = ?, worldpay_response = ? WHERE id = ?`,
        [statusResponse.status || 'unknown', JSON.stringify(statusResponse), payoutId],
        err => err ? reject(err) : resolve()
      );
    });

    const updatedPayout = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM payouts WHERE id = ?', [payoutId], (err, row) => {
        err ? reject(err) : resolve(row);
      });
    });

    res.json({ payout: updatedPayout, worldpay: statusResponse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh status' });
  }
});

export default router;
