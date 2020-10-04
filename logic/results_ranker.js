class ResultsRanker {
  constructor() {
    this._lapTimes = [];
    this._totalTimes = [];
    this._crashCounts = [];
  }

  addResults(driverResult) {
    // Deal with laptimes
    const { lapTimes } = driverResult;
    this._lapTimes.push(...lapTimes);
    this._lapTimes.sort((a, b) => a - b);
    const lapRank = this._lapTimes.indexOf(Math.min(...lapTimes));

    // Deal with total time.
    const { totalTime } = driverResult;
    this._totalTimes.push(totalTime);
    this._totalTimes.sort((a, b) => a - b);
    const totalRank = this._totalTimes.indexOf(totalTime);

    // Deal with the crash count.
    const { crashCount } = driverResult;
    this._crashCounts.push(crashCount);
    // Sort in reverse numerical order as more crashes is better!
    this._crashCounts.sort((a, b) => b - a);
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
  }
}

module.exports = { ResultsRanker };
