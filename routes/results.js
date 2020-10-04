const express = require('express');
const { DriverResult } = require('../src/api/driver_result.js');
const { ResultsRanker } = require('../logic/results_ranker.js');

const router = express.Router();

const resultsRankerMap = {};

/* GET home page. */
router.post('/driver', (req, res, _next) => {
  const driverResults = req.body.map((s) => DriverResult.fromFlatData(s));
  const { trackName } = driverResults[0];
  if (!(trackName in resultsRankerMap)) {
    // First results for lap.
    resultsRankerMap[trackName] = new ResultsRanker();
  }
  const response = resultsRankerMap[trackName].addResults(driverResults);
  res.json(response);
});

module.exports = router;
