import * as PIXI from 'pixi.js';

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

function setupScoreboardScreen(app, raceResults,
  transitionToConfigScreen, transitionToActualRace) {
  // TODO: receive scores from the previous state.
  // TODO: post scores to server.
  // TODO: render scores from server.
  const container = new PIXI.Container();

  const richText = new PIXI.Text('Rich text with a lot of options and across multiple lines', style);
  richText.x = 50;
  richText.y = 220;

  container.addChild(richText);

  const playerOneScoreText = new PIXI.Text(`
  Player one
    Cap Count: ${raceResults.lapcounts[0]}
    Crashcounts: ${raceResults.crashcounts[0]}
    Lap Times: ${raceResults.laptimes[0].map((v) => v / 1000).join('s - ')}s
  `, style);
  const playerTwoScoreText = new PIXI.Text(`
  Player two
    Cap Count: ${raceResults.lapcounts[1]}
    Crashcounts: ${raceResults.crashcounts[1]}
    Lap Times: ${raceResults.laptimes[1].map((v) => v / 1000).join('s - ')}s
  `, style);
  playerOneScoreText.x = 50;
  playerOneScoreText.y = 275;

  playerTwoScoreText.x = app.renderer.width / 2;
  playerTwoScoreText.y = 275;

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

  return container;
}

setupScoreboardScreen.resources = [
  'ui/icons/back-to-setting.png',
  'ui/icons/retry.png',
];

export default setupScoreboardScreen;
