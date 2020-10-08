import * as PIXI from 'pixi.js';

const sound = require('pixi-sound').default;

const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 48,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: ['#ffffff', '#00ff99'], // gradient
  stroke: '#4a1850',
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 1600,
  lineJoin: 'round',
});

function postResultsToServer(resultsArray, textControls) {
  fetch('/results/driver', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resultsArray.map((i) => i.toFlatData())),
  })
    .then((response) => response.json())
    .then((dataArray) => {
      console.log('Success:', dataArray);
      dataArray.forEach((data, index) => {
        const worldLapsTXT = data.lapRank === 0 ? 'DNF' : `${data.lapRank}/${data.lapCount}`;
        textControls[index].text += `

    World Lap: ${worldLapsTXT}
    World Race Time: ${data.totalRank}/${data.totalCount}
    World Crash Rank: ${data.crashRank}/${data.crashCount}`;
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function setupScoreboardScreen(app, raceResults,
  transitionToConfigScreen, transitionToActualRace) {
  // TODO: receive scores from the previous state.
  // TODO: post scores to server.
  // TODO: render scores from server.
  const container = new PIXI.Container();

  // TODO: If number of laps gets to big change to output to be the fastest
  const pOneFastLapTime = raceResults.driverResults[0].lapTimes.sort((a, b) => a - b)[0];
  const pTwoFastLapTime = raceResults.driverResults[1].lapTimes.sort((a, b) => a - b)[0];
  const playerOneScoreText = new PIXI.Text(`
  ${raceResults.driverResults[0].name}
    Lap Count: ${raceResults.driverResults[0].lapCount}
    Crash Count: ${raceResults.driverResults[0].crashCount}
    Fastest Lap: ${pOneFastLapTime ? `${pOneFastLapTime / 1000}s` : 'DNF'}
  `, style);
  const playerTwoScoreText = new PIXI.Text(`
  ${raceResults.driverResults[1].name}
    Lap Count: ${raceResults.driverResults[1].lapCount}
    Crash Count: ${raceResults.driverResults[1].crashCount}
    Fastest Lap: ${pTwoFastLapTime ? `${pTwoFastLapTime / 1000}s` : 'DNF'}
  `, style);
  playerOneScoreText.x = 50;
  playerOneScoreText.y = 275;

  playerTwoScoreText.x = app.renderer.width / 2;
  playerTwoScoreText.y = 275;

  postResultsToServer(raceResults.driverResults, [playerOneScoreText, playerTwoScoreText]);

  container.addChild(playerOneScoreText);

  container.addChild(playerTwoScoreText);

  const returnToSettingsButton = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/icons/back-to-setting.png'],
  );
  returnToSettingsButton.anchor.set(1.0, 1.0);
  returnToSettingsButton.position.set(app.renderer.width, app.renderer.height);
  container.addChild(returnToSettingsButton);

  returnToSettingsButton.buttonMode = true;
  returnToSettingsButton.interactive = true;

  returnToSettingsButton.on('pointertap', (ev) => {
    console.log('Wants settings: ', ev);
    transitionToConfigScreen();
  });

  const retryRaceButton = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/icons/retry.png'],
  );
  retryRaceButton.anchor.set(0.0, 1.0);
  retryRaceButton.position.set(0, app.renderer.height);
  container.addChild(retryRaceButton);

  retryRaceButton.buttonMode = true;
  retryRaceButton.interactive = true;

  retryRaceButton.on('pointertap', (ev) => {
    console.log('Wants settings: ', ev);
    transitionToActualRace();
  });

  sound.play('assets/audio/music/sketchybeats.mp3', { loop: true, volume: 0.5, speed: 1 });

  return container;
}

setupScoreboardScreen.resources = [
  'ui/icons/back-to-setting.png',
  'ui/icons/retry.png',
];

export default setupScoreboardScreen;
