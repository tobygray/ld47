import ControllerBase from './controllerbase';

class TouchController extends ControllerBase {
  constructor(handler) {
    super(handler, 'Touch', 'touch.png');
  }
}

export default TouchController;
