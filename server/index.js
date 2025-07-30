const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
// Raise the limit for request body size to allow larger images for age estimation
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));

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