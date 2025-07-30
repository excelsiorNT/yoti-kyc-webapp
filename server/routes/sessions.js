const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const express = require('express');
const router = express.Router();
const axios = require("axios"); 

// Pass db as a parameter when importing this router
module.exports = (db) => {
  router.post('/', (req, res) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.YOTI_API_KEY}`,
      'Yoti-Sdk-Id': process.env.VITE_WEB_SDK_ID
    }

    const payload = {
      "type": "OVER",
      "digital_id": {
          "allowed": true,
          "threshold": 18,
          "level": "NONE",
          "retry_limit": 1
      },
      "doc_scan": {
          "allowed": true,
          "threshold": 18,
          "authenticity": "AUTO",
          "level": "PASSIVE",
          "preset_issuing_country": "GBR"
      },
      "age_estimation": {
          "allowed": true,
          "threshold": 12,
          "level": "PASSIVE",
          "retry_limit": 1
      },
      "mobile":{
          "allowed": false,
          "threshold": 18,
          "level": "NONE"
      },
      "reference_id": req.body.username || "123123",
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