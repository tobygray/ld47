import createViewElementInDom from './viewer';

import setupRaceConfigScreen from './setup_screen';
import setupWelcomeScreen from './welcome_screen';
import setupTrackEvent from './track_screen';
import setupScoreboardScreen from './scoreboard_screen';
import ControllerHandler from './controller/handler';

const sound = require('pixi-sound').default;

const ALL_SCREEN_RESOURCES = [
  setupWelcomeScreen.resources,
  setupRaceConfigScreen.resources,
  setupTrackEvent.resources,
  setupScoreboardScreen.resources,
];

function setup(app) {
  app.stage.sortableChildren = true;
  const controllerHandler = new ControllerHandler(app);

  // Cyclical depndency problem
  let transitionToConfigScreen;
  let transitionToActualRace;

  function resetScreenAndSound() {
    app.stage.removeChildren();
    controllerHandler.reAdd();
    sound.speedAll = 1;
    sound.stopAll();
  }

  function transitionToScoreboard(raceConfig, raceResults) {
    resetScreenAndSound();
    controllerHandler.enablePolling();
    // TODO: the functions we pass in to this setup for the scoreborad need to actually
    //       be closures holding references to the previous setup in order to handle
    //       default settings for the new race.
    const scoreboardScreen = setupScoreboardScreen(
      app,
      raceResults,
      () => transitionToConfigScreen(raceConfig),
      () => transitionToActualRace(raceConfig),
    );
    app.stage.addChild(scoreboardScreen);
  }

  transitionToActualRace = (raceConfig) => {
    resetScreenAndSound();
    const trackScreen = setupTrackEvent(app, transitionToScoreboard, raceConfig);
    app.stage.addChild(trackScreen);
  };

  transitionToConfigScreen = (raceConfig = null) => {
    resetScreenAndSound();
    const setupScreen = setupRaceConfigScreen(app, controllerHandler, raceConfig,
      transitionToActualRace);
    app.stage.addChild(setupScreen);
  };

  const welcomeScreen = setupWelcomeScreen(app, transitionToConfigScreen);
  app.stage.addChild(welcomeScreen);
}

document.addEventListener('DOMContentLoaded', () => {
  createViewElementInDom([...new Set([].concat(...ALL_SCREEN_RESOURCES))], setup);
});
