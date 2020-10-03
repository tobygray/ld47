import * as PIXI from 'pixi.js';
import TRACK_INFO from './track_info';
import createTrackPicker from './track_picker_widget';
import createControllerPicker from './controller_picker_widget';
import RaceConfig from './race_config';

function setupRaceConfigScreen(app, controllerHandler, transitionToRaceCallback) {
  const raceConfig = new RaceConfig(controllerHandler);
  const container = new PIXI.Container();

  const bgImage = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/race-setup-background.png'],
  );
  bgImage.position.set(0, 0);
  container.addChild(bgImage);

  container.addChild(createTrackPicker(app, raceConfig));
  container.addChild(createControllerPicker(app, controllerHandler, raceConfig));

  const launchButton = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/icons/launch-race.png'],
  );
  launchButton.anchor.set(1.0, 1.0);
  launchButton.position.set(app.renderer.width, app.renderer.height);
  launchButton.visible = false;
  container.addChild(launchButton);

  raceConfig.setChangeListener(() => {
    const { valid } = raceConfig;
    launchButton.buttonMode = valid;
    launchButton.interactive = valid;
    launchButton.visible = valid;
  });

  launchButton.on('pointertap', (ev) => {
    console.log(ev);
    app.stage.removeChild(container);
    raceConfig.setChangeListener(null);
    transitionToRaceCallback(raceConfig);
  });

  return container;
}

setupRaceConfigScreen.resources = [
  'ui/race-setup-background.png',
  'ui/icons/close-cross.png',
  'ui/icons/keyboard.png',
  'ui/icons/mouse.png',
  'ui/icons/controller.png',
  'ui/icons/touch.png',
  'ui/icons/launch-race.png',
  ...TRACK_INFO.map((track) => track.preview_file),
];

export default setupRaceConfigScreen;
