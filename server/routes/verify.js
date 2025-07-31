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

  // Endpoint to verify age and liveness using Yoti Age Estimation Verify API
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

    if (response.statusCode == 200) {
      let body = JSON.parse(response.body)
      try {
        const result = body.age.age_check === "pass" && body.antispoofing.prediction === "real";
        db.run(
          'UPDATE users SET is_verified = ? WHERE id = ?',
          [result, req.body.user_id],
          function (err) {
            if (err) {
              console.error('Error updating user result:', err);
              return res.status(500).json({ error: 'Database update failed' });
            }
            console.log('User session updated successfully');
          }
        )
        res.send({'result': result});
      } catch (error) {
        console.error('Error processing response:', error);
        return res.status(500).json({ error: 'Error processing response' });
      }
    }
  });

  // Endpoint to get the verification result using Yoti Get Results API
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
        let isVerified = response.data.status === "COMPLETE"
        if (isVerified) {
          // Update the user verification status in the database
          try {
            db.run(
              'UPDATE users SET is_verified = ? WHERE id = ?',
              [isVerified, Number(response.data.reference_id)],
              function (err) {
                if (err) {
                  console.error('Error updating user result:', err);
                  return res.status(500).json({ error: 'Database update failed' });
                }
                console.log('User session updated successfully');
              }
            )
          } catch (error) {
            console.error('Error processing response:', error);
            return res.status(500).json({ error: 'Error processing response' });
          }
        }
        
        res.json({status: isVerified});
      })
      .catch(error => {
        console.error(error);
        res.status(500).send(error);
      });
  });

  return router;
};