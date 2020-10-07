import * as PIXI from 'pixi.js';
import TRACK_INFO from './track_info';

const SELECTED_TINT = 0xFFFFFF;
const UNSELECTED_TINT = 0xAAAAAA;

function createTrackPicker(app, raceConfig) {
  const container = new PIXI.Container();

  let defaultTrackCallback;

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

    const setActive = () => {
      // Add a border on the current clicked one.
      currentTrackTexture.scale.set(1.35, 1.35);
      currentTrackTexture.tint = SELECTED_TINT;
    };
    const buttonSelectedCallback = (_evt) => {
      // Deselect all the tracks:
      trackSprites.forEach((anOldTrack) => {
        anOldTrack.scale.set(1, 1);
        anOldTrack.tint = UNSELECTED_TINT;
      });

      // Highlight this one.
      setActive();

      // Record the choice!
      raceConfig.track = track;
    };
    currentTrackTexture.on('pointertap', buttonSelectedCallback);

    if (!defaultTrackCallback) {
      defaultTrackCallback = buttonSelectedCallback;
    }

    if (raceConfig.track && track === raceConfig.track) {
      // Has a previous configuration which has this track selected.
      setActive();
    } else {
      currentTrackTexture.tint = UNSELECTED_TINT;
    }

    return currentTrackTexture;
  });

  // Call the callback to pick a track as though we'd clicked on one
  if (!raceConfig.track) {
    defaultTrackCallback();
  }

  container.addChild(...trackSprites);
  return container;
}

export default createTrackPicker;
