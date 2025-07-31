const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const express = require('express');
const router = express.Router();
const axios = require("axios"); 

// Pass db as a parameter when importing this router
module.exports = (db) => {
  // Endpoint to create a new session using Yoti Create Session API
  router.post('/', (req, res) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.YOTI_API_KEY}`,
      'Yoti-Sdk-Id': process.env.VITE_WEB_SDK_ID
    }

    const payload = {
      "type": "OVER",
      // Allow the use of Digital ID
      "digital_id": {
          "allowed": true,
          "threshold": 18,
          "level": "NONE",
          "retry_limit": 1
      },
      // Allow the use of Document Scan
      "doc_scan": {
          "allowed": true,
          "threshold": 18,
          "authenticity": "AUTO",
          "level": "PASSIVE",
          "preset_issuing_country": "GBR"
      },
      // Disable the use of age estimation service
      "age_estimation": {
          "allowed": false,
          "threshold": 18,
          "level": "PASSIVE",
          "retry_limit": 1
      },
      // Disable the use of mobile verification
      "mobile":{
          "allowed": false,
          "threshold": 18,
          "level": "NONE"
      },
      "reference_id": req.body.user_id.toString() || "123123",
      // Set the session expiry time to 1 hour
      "ttl": 3600,
      "callback": {
          "url":"https://localhost:3000/result",
          "auto": true
      },
      "cancel_url": "https://localhost:3000/result",
      "login": {
          "allowed": true
      },
      "notification_url": "https://localhost:3000/result",
      "block_biometric_consent": false,
      // Enable retry and resume for the session
      "retry_enabled": true,
      "resume_enabled": true
    }

    const config = {
      url: `${process.env.API_ENDPOINT}/api/v1/sessions`,
      method: 'post',
      headers: headers,
      data: JSON.stringify(payload)
    }

    axios.request(config)
    .then(response => {
      console.log(JSON.stringify(response.data));

      // Update the user's session ID and expiry time in the database
      // Ideally, web app should fetch this data from the server
      // but for simplicity, the session ID and expiry time are stored in LocalStorage
      db.run('UPDATE users SET session_id = ?, session_expires_at = ? WHERE id = ?',
        [response.data.id, response.data.expires_at, req.body.user_id],), (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
      }

      // Return the session data along with the Yoti service URL for the client to use
      const data = {
        ...response.data,
        url: `${process.env.API_ENDPOINT}/age-estimation?sessionId=${response.data.id}&sdkId=${process.env.VITE_WEB_SDK_ID}`
      }
      res.json(data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send(error);
    });
  });

  return router;
};