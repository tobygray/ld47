import ControllerBase from './controllerbase';

class MouseController extends ControllerBase {
  constructor(handler) {
    super(handler, 'Mouse', 'mouse.png');
  }
}

export default MouseController;
