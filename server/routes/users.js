const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
  // Endpoint to register a new user
  router.post('/', (req, res) => {
    const { username, email, password } = req.body;
    // Hash the password before storing it
    const hash = bcrypt.hashSync(password, 10);

    // Add a new user to the database
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