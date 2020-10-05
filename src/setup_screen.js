import * as PIXI from 'pixi.js';
import TRACK_INFO from './track_info';
import createTrackPicker from './track_picker_widget';
import createControllerPicker from './controller_picker_widget';
import RaceConfig from './race_config';

const sound = require('pixi-sound').default;

const NO_TINT = 0xFFFFFF;
const DISABLED_TINT = 0x999999;

function setupRaceConfigScreen(app, controllerHandler, raceConfig, transitionToRaceCallback) {
  if (!raceConfig) {
    raceConfig = new RaceConfig(controllerHandler);
  }
  const container = new PIXI.Container();

  const bgImage = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/race-setup-background.png'],
  );
  bgImage.position.set(0, 0);
  container.addChild(bgImage);

  container.addChild(createTrackPicker(app, raceConfig));
  const controllerPicker = createControllerPicker(app, controllerHandler, raceConfig);
  container.addChild(controllerPicker);

  const launchButton = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/icons/launch-race.png'],
  );
  launchButton.anchor.set(1.0, 1.0);
  launchButton.position.set(app.renderer.width, app.renderer.height);
  launchButton.tint = DISABLED_TINT;
  container.addChild(launchButton);

  const validityChecker = () => {
    const { valid } = raceConfig;
    launchButton.buttonMode = valid;
    launchButton.interactive = valid;
    launchButton.tint = valid ? NO_TINT : DISABLED_TINT;
  };
  raceConfig.setChangeListener(validityChecker);
  // Current state might be valid if inherited from a previous race.
  validityChecker();

  launchButton.on('pointertap', (_ev) => {
    app.stage.removeChild(container);
    controllerPicker.destroy();
    raceConfig.setChangeListener(null);
    transitionToRaceCallback(raceConfig);
  });

  sound.play('assets/audio/music/sketchybeats.mp3', { loop: true, volume: 0.5, speed: 1 });

  return container;
}

setupRaceConfigScreen.resources = [
  'ui/race-setup-background.png',
  'ui/icons/close-cross.png',
  'ui/icons/add-mouse.png',
  'ui/icons/add-touch.png',
  'ui/icons/keyboard.png',
  'ui/icons/mouse.png',
  'ui/icons/throttle.png',
  'ui/icons/throttle-handle.png',
  'ui/icons/controller.png',
  'ui/icons/touch.png',
  'ui/icons/launch-race.png',
  ...TRACK_INFO.map((track) => track.preview_file),
  ...TRACK_INFO.filter((track) => track.background).map((track) => track.background),
  ...TRACK_INFO.filter((track) => track.music).map((track) => track.music),
];

export default setupRaceConfigScreen;
