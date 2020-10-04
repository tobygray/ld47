const assert = require('assert');
const sinon = require('sinon');
const { DriverResult } = require('../src/api/driver_result.js');

describe('Check crash count', () => {
  const driverResult = new DriverResult();
  it('starts zero', () => {
    assert.strictEqual(driverResult.crashCount, 0);
  });
  it('adds one', () => {
    driverResult.crashed();
    assert.strictEqual(driverResult.crashCount, 1);
    driverResult.crashed();
    assert.strictEqual(driverResult.crashCount, 2);
  });
});

describe('Check name behaviour', () => {
  const expectedTrackName = 'Kitten Town';
  const driverResult = new DriverResult(47, expectedTrackName);
  it('has a default name', () => {
    assert.strictEqual(driverResult.name, 'Player 48');
    assert.strictEqual(driverResult.trackName, expectedTrackName);
  });
  it('can have name set', () => {
    const newName = 'Bob';
    driverResult.name = newName;
    assert.strictEqual(driverResult.name, newName);
    assert.strictEqual(driverResult.trackName, expectedTrackName);
  });
});

describe('Check lap recording', () => {
  const driverResult = new DriverResult();
  // Use a fake clock to create fake time data.
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    clock.restore();
  });

  it('starts with no laps', () => {
    assert.strictEqual(driverResult.lapCount, 0);
    assert.deepStrictEqual(driverResult.lapTimes, []);
  });
  it('can create one lap', () => {
    driverResult.startTime = Date.now();
    clock.tick(100);
    driverResult.startLap();
    assert.strictEqual(driverResult.lapCount, 1);
    assert.deepStrictEqual(driverResult.lapTimes, [100]);

    clock.tick(150);
    driverResult.startLap();
    assert.strictEqual(driverResult.lapCount, 2);
    assert.deepStrictEqual(driverResult.lapTimes, [100, 150]);

    clock.tick(75);
    driverResult.startLap();
    assert.strictEqual(driverResult.lapCount, 3);
    assert.deepStrictEqual(driverResult.lapTimes, [100, 150, 75]);
  });
});

describe('can serialize and deserialize', () => {
  const expectedIndex = 123;
  const expectedName = 'Nigel';
  const expectedCrashCount = 7;
  const expectedLapTimes = [123, 987, 23, 43];
  const expectedTrackName = 'Grand Laguna Beach';
  // Use a fake clock to create fake time data.
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    clock.restore();
  });

  let jsonData = '';
  it('can serialize', () => {
    const driverResult = new DriverResult(expectedIndex, expectedTrackName);
    driverResult.name = expectedName;
    for (let i = 0; i < expectedCrashCount; i += 1) {
      driverResult.crashed();
    }
    driverResult.startTime = Date.now();
    expectedLapTimes.forEach((delay) => {
      clock.tick(delay);
      driverResult.startLap();
    });

    jsonData = driverResult.toJson();
    assert.notStrictEqual(jsonData, '');
  });
  it('it deserializes', () => {
    const driverResult = DriverResult.fromJson(jsonData);
    assert.strictEqual(driverResult.index, expectedIndex);
    assert.strictEqual(driverResult.name, expectedName);
    assert.strictEqual(driverResult.crashCount, expectedCrashCount);
    assert.deepStrictEqual(driverResult.lapCount, expectedLapTimes.length);
    assert.deepStrictEqual(driverResult.lapTimes, expectedLapTimes);
    assert.deepStrictEqual(driverResult.trackName, expectedTrackName);
  });
});

describe('can deserialize already parsed json', () => {
  const expectedIndex = 896;
  const driverResult = new DriverResult(expectedIndex);
  it('can handle pre-parsed json', () => {
    const jsonData = driverResult.toJson();
    const data = JSON.parse(jsonData);

    const newDriverResult = DriverResult.fromJson(data);
    assert.strictEqual(newDriverResult.index, expectedIndex);
  });
});
