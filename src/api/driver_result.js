class DriverResult {
  constructor(index) {
    this._index = index;
    this._name = null;
    this._lapTimes = [];
    this._crashCount = 0;
    this._startTime = 0;
    this._lapStartTime = 0;
  }

  set startTime(startTime) {
    this._startTime = startTime;
    this._lapStartTime = startTime;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    if (this._name) {
      return this._name;
    }
    return `Player ${this._index + 1}`;
  }

  get lapCount() {
    return this._lapTimes.length;
  }

  get lapTimes() {
    return [...this._lapTimes];
  }

  get crashCount() {
    return this._crashCount;
  }

  startLap() {
    const now = Date.now();
    this._lapTimes.push(now - this._lapStartTime);
    this._lapStartTime = now;
  }

  crashed() {
    this._crashCount = 1;
  }
}

export default DriverResult;
