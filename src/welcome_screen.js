import * as PIXI from 'pixi.js';
import Track from './track';

const sound = require('pixi-sound').default;

const TRACK_DATA = [
  's4', 's', 's', 's', 'r4', 'r4', 'r4', 'r4',
  's', 'r4', 'r4', 'r4', 'r4',
  's4', 's4', 's4', 's4', 'r4', 'r4', 'r4', 'r4',
  's', 'r4', 'r4', 'r4', 'r4',
  's4', 's4', 's',
];

const CREDITS = [
  'assets/credits/with.png',
  'assets/credits/alan.png',
  'assets/credits/dan.png',
  'assets/credits/jem.png',
  'assets/credits/jon.png',
  'assets/credits/sam.png',
  'assets/credits/toby.png',
];

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
  track.container.x = app.renderer.width / 2;
  track.container.y = app.renderer.height / 8;

  function rainbowFart() {
    return Math.random() * 0xFFFFFF;
  }

  track.carA.generateTint = rainbowFart;
  track.carB.generateTint = rainbowFart;

  const menuLoop = (() => {
    const creditSprites = CREDITS.map((imgPath) => {
      const sprite = new PIXI.Sprite(
        PIXI.utils.TextureCache[imgPath],
      );
      sprite.position.set(app.renderer.width / 2, (app.renderer.height * 8) / 9);
      sprite.anchor.set(0.5, 0.5);
      sprite.visible = false;
      container.addChild(sprite);
      return sprite;
    });

    let currentPos = 0;

    // Start with "with" visible
    let activeCredit = creditSprites[currentPos];
    activeCredit.visible = true;

    function menuLoopImpl(delta) {
      // Run cars real nice and slow?
      track.carA.power = 0.468;
      track.carB.power = 0.451;

      track.updateCars(delta);
      // Every 20 segments we change the credit
      if (track.carB.totalTrack > currentPos && track.carB.totalTrack % 20 === 0) {
        currentPos = track.carB.totalTrack;
      } else {
        return;
      }

      if (activeCredit) {
        activeCredit.visible = false;
      }
      // Pick a random one but don't show with again
      activeCredit = creditSprites[1 + Math.trunc(Math.random() * (CREDITS.length - 1))];
      activeCredit.visible = true;
    }

    app.ticker.add(menuLoopImpl);
    return menuLoopImpl;
  })();

  container.addChild(track.container);

  const playButton = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/icons/play.png'],
  );
  playButton.anchor.set(0.5, 0.5);
  playButton.position.set(app.renderer.width / 2, (app.renderer.height * 3) / 5);

  container.addChild(playButton);

  function playClickTouchEvent(_ev) {
    app.stage.removeChild(container);
    app.ticker.remove(menuLoop);
    window.removeEventListener('click', playClickTouchEvent);
    window.removeEventListener('touchend', playClickTouchEvent);
    completionFunction();
  }
  window.addEventListener('click', playClickTouchEvent);
  window.addEventListener('touchend', playClickTouchEvent);
  // Only go full screen on the first user click.
  document.onclick = () => {
    document.body.requestFullscreen();
    document.onclick = null;
  };
  // Only go full screen on the first user tap.
  document.ontouchend = () => {
    document.body.requestFullscreen();
    document.ontouchend = null;
  };
  // But always go full screen on double click.
  document.ondblclick = () => {
    document.body.requestFullscreen();
  };

  sound.play('assets/audio/music/sketchybeats.mp3', { loop: true, volume: 0.5, speed: 1 });

  return container;
}

setupWelcomeScreen.resources = [
  'ui/icons/play.png',
  'ui/menu-background.png',
  'assets/audio/music/sketchybeats.mp3',
  ...CREDITS,
];

export default setupWelcomeScreen;
