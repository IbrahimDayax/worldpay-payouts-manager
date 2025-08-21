import bcrypt from 'bcryptjs';
import db, { initDb } from './db.js';
import { config } from './config.js';

async function seedAdmin() {
  try {
    await initDb();

    const existingAdmin = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [config.admin.email], (err, row) => {
        err ? reject(err) : resolve(row);
      });
    });

    if (existingAdmin) {
      console.log('Admin already exists:', config.admin.email);
      process.exit(0);
    }

    const hash = await bcrypt.hash(config.admin.password, 10);
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [config.admin.name, config.admin.email, hash, 'admin'],
        err => err ? reject(err) : resolve()
      );
    });

    console.log('✅ Admin created:', config.admin.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
