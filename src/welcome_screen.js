import * as PIXI from 'pixi.js';

function setupWelcomeScreen(app, completionFunction) {
  const container = new PIXI.Container();

  const bgImage = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/menu-background.png'],
  );
  bgImage.position.set(0, 0);

  const playButton = new PIXI.Sprite(
    PIXI.utils.TextureCache['ui/icons/play.png'],
  );
  playButton.anchor.set(0.5, 0.5);
  playButton.position.set(app.renderer.width / 2, app.renderer.height / 2);

  // using a container to quickly chuck away the menu when we're done with it
  container.addChild(bgImage);
  container.addChild(playButton);

  window.addEventListener('click', function playClickEvent(ev) {
    console.log(ev);
    app.stage.removeChild(container);
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
