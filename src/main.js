import * as PIXI from 'pixi.js';

import setupRaceConfigScreen from './setup_screen';
import setupWelcomeScreen from './welcome_screen';
import setupTackEvent from './track_screen';
import setupScoreboardScreen from './scoreboard_screen';

const ALL_SCREEN_RESOURCES = [
  setupWelcomeScreen.resources,
  setupRaceConfigScreen.resources,
  setupTackEvent.resources,
  setupScoreboardScreen.resources,
];

let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}

PIXI.utils.sayHello(type);

function loadProgressHandler(loader, resource) {
  // NOTE: resource.data lets you access the file's raw binary data

  // Display the file `url` currently being loaded
  console.log('loading: ' + resource.url);

  // Display the percentage of files currently loaded
  console.log('progress: ' + loader.progress + '%');
}

function setup(app) {
  document.body.appendChild(app.view);

  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.display = 'block';
  app.renderer.autoResize = true;
  app.renderer.resize(1920, 1080);

  // Cyclical depndency problem
  let transitionToConfigScreen;
  let transitionToActualRace;

  function transitionToScoreboard() {
    console.log('Transitioning to scoreboard');
    app.stage.removeChildren();
    // TODO: the functions we pass in to this setup for the scoreborad need to actually
    //       be closures holding references to the previous setup in order to handle
    //       default settings for the new race.
    const scoreboardScreen = setupScoreboardScreen(
      app, transitionToConfigScreen, transitionToActualRace,
    );
    app.stage.addChild(scoreboardScreen);
  }
  // Hack to enable testing without breaking all the merges:
  window.transitionToScoreboard = transitionToScoreboard; // TODO: delete me!

  transitionToActualRace = (raceConfig) => {
    console.log('Trqnsistioning to Race, yes I Cant spell!');
    app.stage.removeChildren();
    const trackScreen = setupTackEvent(app, transitionToScoreboard, raceConfig);
    app.stage.addChild(trackScreen.container);
    app.ticker.add((delta) => trackScreen.gameLoop(delta));
  };

  transitionToConfigScreen = () => {
    console.log('Transitioning to config screen');
    app.stage.removeChildren();
    const setupScreen = setupRaceConfigScreen(app, transitionToActualRace);
    app.stage.addChild(setupScreen);
  };

  const welcomeScreen = setupWelcomeScreen(app, transitionToConfigScreen);
  app.stage.addChild(welcomeScreen);
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new PIXI.Application({
    width: 256, // default: 800
    height: 256, // default: 600
    antialias: true, // default: false
    transparent: false, // default: false
    resolution: 1, // default: 1
  });

  PIXI.Loader.shared.onProgress.add(loadProgressHandler);

  // Load stuff for UI
  PIXI.Loader.shared
    .add([].concat(...ALL_SCREEN_RESOURCES))
    .load(() => setup(app));
});
