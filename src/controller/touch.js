import ControllerBase from './controllerbase';

function generateVibratePattern(lengthMs, intensity) {
  // Use a duty cycle over the length of the specified period.
  return [lengthMs * intensity, lengthMs * (1 - intensity)];
}

class TouchController extends ControllerBase {
  constructor(handler) {
    super(handler, 'Touch', 'touch.png');
    this.canVibrate = 'vibrate' in window.navigator;
  }

  setDangerValue(newValue) {
    if (!this.canVibrate) {
      return;
    }
    if (newValue === 0) {
      return;
    }
    window.navigator.vibrate(generateVibratePattern(50, newValue));
  }
}

export default TouchController;
