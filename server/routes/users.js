const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Pass db as a parameter when importing this router
module.exports = (db) => {
  router.post('/', (req, res) => {
    const { username, email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hash],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          } else {
            return res.status(400).json({ error: err.message });
          }
        }
        res.json({ id: this.lastID, username, email });
      }
    );
  });

  return router;
};