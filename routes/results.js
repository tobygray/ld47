const express = require('express');
const { DriverResult } = require('../src/api/driver_result.js');

const router = express.Router();

/* GET home page. */
router.post('/driver', (req, res, _next) => {
  const driverResult = DriverResult.fromJson(req.body);
  console.log('Got driver result', driverResult);
  const response = {
    message: 'thank you',
  };
  res.json(response);
});

module.exports = router;
