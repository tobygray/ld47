import * as PIXI from 'pixi.js';

function setupTackEvent(_app, _raceOverCallback) {
  const container = new PIXI.Container();

  // TODO: Writ actual code to render track here
  // const bgImage = new PIXI.Sprite(
  //   PIXI.utils.TextureCache['ui/race-setup-background.png'],
  // );
  // bgImage.position.set(0, 0);
  // container.addChild(bgImage);

  return container;
}

setupTackEvent.resources = [];

export default setupTackEvent;
