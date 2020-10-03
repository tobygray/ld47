import * as PIXI from 'pixi.js';
import TRACK_INFO from './track_info';
import createTrackPicker from './track_picker_widget';
import createControllerPicker from './controller_picker_widget';

function setupRaceConfigScreen(app, transitionToRaceCallback) {
  const raceConfig = {
    // TODO: make this a proper object with things like track selection.
    controllers: [],
  };
  const container = new PIXI.Container();

  const bgImage = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/race-setup-background.png'],
  );
  bgImage.position.set(0, 0);
  container.addChild(bgImage);

  container.addChild(createTrackPicker(app, raceConfig));
  container.addChild(createControllerPicker(app, raceConfig));

  const launchButton = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/icons/launch-race.png'],
  );
  launchButton.anchor.set(1.0, 1.0);
  launchButton.position.set(app.renderer.width, app.renderer.height);
  container.addChild(launchButton);

  launchButton.buttonMode = true;
  launchButton.interactive = true;

  launchButton.on('pointertap', (ev) => {
    console.log(ev);
    app.stage.removeChild(container);
    // TODO: What track and inputs to use
    transitionToRaceCallback(raceConfig);
  });

  return container;
}

setupRaceConfigScreen.resources = [
  'ui/race-setup-background.png',
  'ui/icons/keyboard.png',
  'ui/icons/mouse.png',
  'ui/icons/controller.png',
  'ui/icons/touch.png',
  'ui/icons/launch-race.png',
  ...TRACK_INFO.map((track) => track.preview_file),
];

export default setupRaceConfigScreen;
