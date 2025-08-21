import express from 'express';
import bcrypt from 'bcryptjs';
import db from './db.js';
import { requireAuth, requireRole } from './auth.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [req.user.id],
        (err, row) => err ? reject(err) : resolve(row)
      );
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const users = await new Promise((resolve, reject) => {
      db.all(
        'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC',
        [],
        (err, rows) => err ? reject(err) : resolve(rows)
      );
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const hash = await bcrypt.hash(password, 10);

    const userId = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [name, email.toLowerCase(), hash, role],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE')) {
              reject(new Error('Email already exists'));
            } else {
              reject(err);
            }
          } else {
            resolve(this.lastID);
          }
        }
      );
    });

    const newUser = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [userId],
        (err, row) => err ? reject(err) : resolve(row)
      );
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (error.message === 'Email already exists') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (req.user.id === userId) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    const changes = await new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        err ? reject(err) : resolve(this.changes);
      });
    });

    if (changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
