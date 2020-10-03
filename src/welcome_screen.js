import * as PIXI from 'pixi.js';
import Track from './track';

const TRACK_DATA = ['s', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'r1', 'r1', 'r1', 'r1', 'r1', 'r1', 'r1', 'r1', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'l1', 'l1', 'l1', 'l1', 'l1', 'l1', 'l1', 'l1', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'l4', 'l4', 'l4', 'l4', 'l4', 'l4', 'l4', 'l4', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'l1', 'l1', 'l1', 'l1', 'l1', 'l1', 'l1', 's', 's', 'l2', 'ss', 'ss', 'ss', 'ss', 'ss'];

function setupWelcomeScreen(app, completionFunction) {
  const container = new PIXI.Container();

  const bgImage = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/menu-background.png'],
  );
  bgImage.position.set(0, 0);
  container.addChild(bgImage);

  const track = new Track(TRACK_DATA);
  // TODO work out the scaling factors here properly - this is the same hack as editor and race
  track.container.scale.x = 0.5;
  track.container.scale.y = 0.5;
  track.container.x = 300;
  track.container.y = 400;

  function menuLoop(delta) {
    // Run cars real nice and slow?
    track.leftCar.power = 0.75;
    track.rightCar.power = 0.5;

    track.updateCars(delta);
  }

  app.ticker.add(menuLoop);

  container.addChild(track.container);

  const playButton = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/icons/play.png'],
  );
  playButton.anchor.set(0.5, 0.5);
  playButton.position.set(app.renderer.width / 2, app.renderer.height / 2);

  container.addChild(playButton);

  window.addEventListener('click', function playClickEvent(ev) {
    console.log(ev);
    app.stage.removeChild(container);
    app.ticker.remove(menuLoop);
    window.removeEventListener('click', playClickEvent);
    completionFunction();
  });
  // Only go full screen on the first user click.
  document.onclick = () => {
    document.querySelector('canvas').requestFullscreen();
    document.onclick = null;
  };
  // But always go full screen on double click.
  document.ondblclick = () => {
    document.querySelector('canvas').requestFullscreen();
  };

  return container;
}

setupWelcomeScreen.resources = [
  'ui/icons/play.png',
  'ui/menu-background.png',
];

export default setupWelcomeScreen;
