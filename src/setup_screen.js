import * as PIXI from 'pixi.js';

function setupRaceConfigScreen(app, transitionToRaceCallback) {
  const raceState = {}; // TODO:
  const container = new PIXI.Container();

  const bgImage = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/race-setup-background.png'],
  );
  bgImage.position.set(0, 0);
  container.addChild(bgImage);

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
    transitionToRaceCallback(raceState);
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
];

export default setupRaceConfigScreen;
