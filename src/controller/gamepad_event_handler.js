import GamepadController from './gamepad';

const SCAN_INTERVAL_MS = 50;

class GamepadEventHandler {
  constructor() {
    this.controllers = {};
    this.newControllerListener = null;
    this.removedControllerListener = null;

    window.addEventListener('gamepadconnected', (event) => { this.gamepadConnectedListener(event); });
    window.addEventListener('gamepaddisconnected', (event) => { this.gamepadDisconnectedListener(event); });
    this.pollingInterval = null;
    this.enablePolling();
  }

  enablePolling() {
    if (!this.pollingInterval) {
      this.pollingInterval = setInterval(() => { this.scanGamepads(); }, SCAN_INTERVAL_MS);
    }
  }

  setNewControllerListener(listener) {
    this.newControllerListener = listener;
  }

  setRemovedControllerListener(listener) {
    this.removedControllerListener = listener;
  }

  addController(controller) {
    this.controllers[controller.index] = controller;
  }

  removeController(controller) {
    if (this.controllers[controller.index] === controller) {
      delete this.controllers[controller.index];
    } else {
      console.warn('Failed to remove controller', controller);
    }
  }

  gamepadConnectedListener(event) {
    console.log('Gamepad connected at index %d: %s', event.gamepad.index, event.gamepad.id);
    if (event.gamepad.index in this.controllers) {
      console.warn('Ignoring duplicate controller index');
    } else {
      const controller = new GamepadController(this, event.gamepad.index);
      if (this.newControllerListener) {
        this.newControllerListener(controller);
      }
    }
  }

  gamepadDisconnectedListener(event) {
    console.log('Gamepad disconnected at index %d: %s', event.gamepad.index, event.gamepad.id);
    if (event.gamepad.index in this.controllers) {
      if (this.removedControllerListener) {
        this.removedControllerListener(this.controllers[event.gamepad.index]);
      }
      this.controllers[event.gamepad.index].remove();
    }
  }

  forAllGamepads(action) {
    Object.values(this.controllers).forEach(action);
  }

  scanGamepads() {
    this.forAllGamepads((controller) => {
      controller.scan();
    });
  }
}

export default GamepadEventHandler;
