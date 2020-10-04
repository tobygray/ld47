const assert = require('assert');
const { default: DriverResult } = require('../src/api/driver_result.js');

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
  const driverResult = new DriverResult(47);
  it('has a default name', () => {
    assert.strictEqual(driverResult.name, 'Player 48');
  });
  it('can have name set', () => {
    const newName = 'Bob';
    driverResult.name = newName;
    assert.strictEqual(driverResult.name, newName);
  });
});

describe('Check lap recording', () => {
  const driverResult = new DriverResult();
  it('starts with no laps', () => {
    assert.strictEqual(driverResult.lapCount, 0);
    assert.deepStrictEqual(driverResult.lapTimes, []);
  });
});

describe('can serialize and deserialize', () => {
  const expectedIndex = 123;
  const expectedName = 'Nigel';
  const expectedCrashCount = 7;
  let jsonData = '';
  it('can serialize', () => {
    const driverResult = new DriverResult(expectedIndex);
    driverResult.name = expectedName;
    for (let i = 0; i < expectedCrashCount; i += 1) {
      driverResult.crashed();
    }

    jsonData = driverResult.toJson();
    assert.notStrictEqual(jsonData, '');
  });
  it('it deserializes', () => {
    const driverResult = DriverResult.fromJson(jsonData);
    assert.strictEqual(driverResult.index, expectedIndex);
    assert.strictEqual(driverResult.name, expectedName);
    assert.strictEqual(driverResult.crashCount, expectedCrashCount);
  });
});
