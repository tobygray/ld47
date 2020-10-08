class ResultsRanker {
  constructor() {
    this._lapTimes = [];
    this._totalTimes = [];
    this._crashCounts = [];
  }

  addResults(driverResults) {
    // First add all the values from the results.
    driverResults.forEach((driverResult) => {
      // Deal with laptimes
      const { lapTimes } = driverResult;
      this._lapTimes.push(...lapTimes);

      // Deal with total time.
      const { totalTime } = driverResult;
      this._totalTimes.push(totalTime);

      // Deal with the crash count.
      const { crashCount } = driverResult;
      this._crashCounts.push(crashCount);
    });

    // Next sort all the arrays of data again.
    this._lapTimes.sort((a, b) => a - b);
    this._totalTimes.sort((a, b) => a - b);
    // Sort in reverse numerical order as more crashes is better!
    this._crashCounts.sort((a, b) => b - a);

    return driverResults.map((driverResult) => {
      // Deal with laptimes
      const { lapTimes } = driverResult;
      const lapRank = this._lapTimes.indexOf(Math.min(...lapTimes));

      // Deal with total time.
      const { totalTime } = driverResult;
      const totalRank = this._totalTimes.indexOf(totalTime);

      // Deal with the crash count.
      const { crashCount } = driverResult;
      const crashRank = this._crashCounts.indexOf(crashCount);

      // Return the results.
      return {
        lapRank: lapRank + 1,
        lapCount: this._lapTimes.length,
        totalRank: totalRank + 1,
        totalCount: this._totalTimes.length,
        crashRank: crashRank + 1,
        crashCount: this._crashCounts.length,
      };
    });
  }
}

module.exports = { ResultsRanker };
