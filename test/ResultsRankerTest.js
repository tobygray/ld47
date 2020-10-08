const assert = require('assert');
const sinon = require('sinon');
const { ResultsRanker } = require('../logic/results_ranker.js');
const { DriverResult } = require('../src/api/driver_result.js');

let clock;

beforeEach(() => {
  clock = sinon.useFakeTimers();
});

afterEach(() => {
  clock.restore();
});

function createDriverResult(crashCount, times) {
  const result = new DriverResult();

  // Fill in the lap times.
  result.startTime = Date.now();
  times.forEach((delay) => {
    clock.tick(delay);
    result.startLap();
  });

  // Fake up the crash count.
  for (let i = 0; i < crashCount; i += 1) {
    result.crashed();
  }
  result.finished();
  return result;
}

describe('check single result', () => {
  const ranker = new ResultsRanker();

  it('can rank single results', () => {
    const result = createDriverResult(1, [2, 3, 10]);
    const ranking = ranker.addResults([result])[0];

    assert.deepStrictEqual(ranking, {
      lapRank: 1,
      lapCount: 3,
      totalRank: 1,
      totalCount: 1,
      crashRank: 1,
      crashCount: 1,
    });
  });
});

describe('check crash count ranking', () => {
  const ranker = new ResultsRanker();

  it('ranks as 1st', () => {
    const rank = ranker.addResults([createDriverResult(3, [])])[0];
    assert.strictEqual(rank.crashRank, 1);
    assert.strictEqual(rank.crashCount, 1);
  });

  it('ranks as 2st', () => {
    const rank = ranker.addResults([createDriverResult(2, [])])[0];
    assert.strictEqual(rank.crashRank, 2);
    assert.strictEqual(rank.crashCount, 2);
  });

  it('ranks ties as lowest', () => {
    const rank = ranker.addResults([createDriverResult(2, [])])[0];
    assert.strictEqual(rank.crashRank, 2);
    assert.strictEqual(rank.crashCount, 3);
    const rank2 = ranker.addResults([createDriverResult(3, [])])[0];
    assert.strictEqual(rank2.crashRank, 1);
    assert.strictEqual(rank2.crashCount, 4);
  });

  it('ranks as lowest', () => {
    const rank = ranker.addResults([createDriverResult(0, [])])[0];
    assert.strictEqual(rank.crashRank, 5);
    assert.strictEqual(rank.crashCount, 5);
  });
});

describe('check total count ranking', () => {
  const ranker = new ResultsRanker();

  it('ranks as 1st', () => {
    const rank = ranker.addResults([createDriverResult(0, [100, 200])])[0];
    assert.strictEqual(rank.totalRank, 1);
    assert.strictEqual(rank.totalCount, 1);
  });

  it('ranks as 2st', () => {
    const rank = ranker.addResults([createDriverResult(0, [160, 160])])[0];
    assert.strictEqual(rank.totalRank, 2);
    assert.strictEqual(rank.totalCount, 2);
  });

  it('ranks ties as lowest', () => {
    const rank = ranker.addResults([createDriverResult(0, [170, 150])])[0];
    assert.strictEqual(rank.totalRank, 2);
    assert.strictEqual(rank.totalCount, 3);
    const rank2 = ranker.addResults([createDriverResult(0, [150, 150])])[0];
    assert.strictEqual(rank2.totalRank, 1);
    assert.strictEqual(rank2.totalCount, 4);
  });

  it('ranks as lowest', () => {
    const rank = ranker.addResults([createDriverResult(0, [200, 200])])[0];
    assert.strictEqual(rank.totalRank, 5);
    assert.strictEqual(rank.totalCount, 5);
  });
});

describe('check lap count ranking', () => {
  const ranker = new ResultsRanker();

  it('ranks as 1st', () => {
    const rank = ranker.addResults([createDriverResult(0, [100, 200])])[0];
    assert.strictEqual(rank.lapRank, 1);
    assert.strictEqual(rank.lapCount, 2);
  });

  it('ranks as 2st', () => {
    const rank = ranker.addResults([createDriverResult(0, [160, 160])])[0];
    assert.strictEqual(rank.lapRank, 2);
    assert.strictEqual(rank.lapCount, 4);
  });

  it('last ranks as 1st', () => {
    const rank = ranker.addResults([createDriverResult(0, [300, 400, 100])])[0];
    assert.strictEqual(rank.lapRank, 1);
    assert.strictEqual(rank.lapCount, 7);
  });
});

describe('check multiple results submission', () => {
  const ranker = new ResultsRanker();

  it('ranks all results together', () => {
    const results1 = createDriverResult(2, [120, 120, 90]);
    const results2 = createDriverResult(1, [100, 100, 110]);
    const ranks = ranker.addResults([results1, results2]);
    assert.deepStrictEqual(ranks[0], {
      lapRank: 1,
      lapCount: 6,
      totalRank: 2,
      totalCount: 2,
      crashRank: 1,
      crashCount: 2,
    });
    assert.deepStrictEqual(ranks[1], {
      lapRank: 2,
      lapCount: 6,
      totalRank: 1,
      totalCount: 2,
      crashRank: 2,
      crashCount: 2,
    });
    assert.strictEqual(ranks.length, 2);
  });
});
