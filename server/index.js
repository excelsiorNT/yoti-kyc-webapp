const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const sqlite3 = require('sqlite3').verbose();

// Open (or create) the database file
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Could not open database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create a users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT,
    password TEXT,
    sesson_id TEXT,
    is_verified BOOLEAN DEFAULT 0
  )
`);

app.set('view engine', 'ejs');
// Raise the limit for request body size to allow larger images for age estimation
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));

// API Routes
const registerRoute = require('./routes/users')(db);
const verifyRoute = require('./routes/verify')(db);
const sessionRoute = require('./routes/sessions')(db);

app.use('/api/users', registerRoute);
app.use('/api/verify', verifyRoute)
app.use('/api/sessions', sessionRoute);

// Serve static files (build directory) from the React app
app.use(express.static(path.join(__dirname, '../build/client')));
app.get('*', (req, res) => {
  res.sendFile('index.html', {root: path.join(__dirname, '../build/client/')});
});

https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'credentials', 'selfsigned.key')),
  cert: fs.readFileSync(path.join(__dirname, 'credentials', 'selfsigned.crt')),
}, app).listen(port, '0.0.0.0');

console.log(`Server running on https://localhost:${port}`);

// Handle graceful shutdown of the database connection
process.on('SIGINT', () => {
  db.close();
  process.exit();
});