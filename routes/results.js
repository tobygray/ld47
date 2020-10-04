const express = require('express');
const { DriverResult } = require('../src/api/driver_result.js');
const { ResultsRanker } = require('../logic/results_ranker.js');

const router = express.Router();

const resultsRankerMap = {};

/* GET home page. */
router.post('/driver', (req, res, _next) => {
  const driverResult = DriverResult.fromJson(req.body);
  console.log('Got driver result', driverResult);
  if (!(driverResult.trackName in resultsRankerMap)) {
    // First results for lap.
    resultsRankerMap[driverResult.trackName] = new ResultsRanker();
  }
  const ranks = resultsRankerMap[driverResult.trackName].addResults(driverResult);
  const response = {
    message: 'thank you',
    lapRank: ranks.lapRank,
    lapCount: ranks.lapCount,
    totalRank: ranks.totalRank,
    totalCount: ranks.totalCount,
    crashRank: ranks.crashRank,
    crashCount: ranks.crashCount,
  };
  res.json(response);
});

module.exports = router;
