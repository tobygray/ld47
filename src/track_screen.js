// import * as PIXI from 'pixi.js';

import * as Track from './track';

function setupTackEvent(_app, _raceOverCallback) {
  const container = Track.makeOvalTrack();
  // TODO work out the scaling factors here properly
  container.scale.x = 0.5;
  container.scale.y = 0.5;
  container.x = 300;
  container.y = 400;

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
