import * as PIXI from 'pixi.js';
import TRACK_INFO from './track_info';

function createTrackPicker(app, raceConfig) {
  const container = new PIXI.Container();

  const trackSprites = TRACK_INFO.map((track, idx) => {
    const currentTrackTexture = new PIXI.Sprite(
      PIXI.utils.TextureCache[track.preview_file],
    );

    currentTrackTexture.anchor.set(0.5, 0.5);
    currentTrackTexture.position.set(
      (app.renderer.width * (idx + 1)) / (TRACK_INFO.length + 1),
      350,
    );

    currentTrackTexture.buttonMode = true;
    currentTrackTexture.interactive = true;

    currentTrackTexture.on('pointertap', (_evt) => {
      // Step 1: deselect all the tracks:
      trackSprites.forEach((anOldTrack) => {
        anOldTrack.scale.set(1, 1);
        anOldTrack.tint = 0xAAAAAA; // Fade a bit
      });

      // Step 2: add a border on the current clicked one now we've removed them all
      currentTrackTexture.scale.set(1.5, 1.5);
      currentTrackTexture.tint = 0xFFFFFF; // No tint
      // Record the choice!
      raceConfig.track = track;
    });

    return currentTrackTexture;
  });

  container.addChild(...trackSprites);
  return container;
}

export default createTrackPicker;
