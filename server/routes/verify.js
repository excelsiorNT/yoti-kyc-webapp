const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const express = require('express');
const router = express.Router();
const { RequestBuilder, Payload } = require('yoti');
const axios = require("axios"); 

const PATHS = {
  AGE: "/age-verify",
  AGE_LIVENESS: "/age-antispoofing-verify",
};

// Pass db as a parameter when importing this router
module.exports = (db) => {
  router.post('/', async (req, res) => {
    const data = {
      img: req.body.img,
      threshold: 25,
      operator: "OVER"
    };
    
    const request = new RequestBuilder()
      .withBaseUrl(process.env.ENDPOINT)
      .withPemFilePath(process.env.PEM_FILE_PATH)
      .withEndpoint(PATHS.AGE_LIVENESS)
      .withPayload(new Payload(data))
      .withMethod('POST')
      .withHeader('X-Yoti-Auth-Id', process.env.VITE_SDK_ID)
      .build();
    const response = await request.execute();
    
    res.send(response.body);
  });

  router.get('/', (req, res) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.YOTI_API_KEY}`,
      'Yoti-Sdk-Id': process.env.VITE_WEB_SDK_ID
    }

    const config = {
      url: `${process.env.API_ENDPOINT}/api/v1/sessions/${req.query.sessionId}/result`,
      method: 'get',
      headers: headers,
    }
    
    axios.request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        res.json(response.data.status);
      })
      .catch(error => {
        console.error(error);
        res.status(500).send(error);
      });
  });

  return router;
};