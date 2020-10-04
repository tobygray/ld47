import ControllerBase from './controller_base';

class MouseController extends ControllerBase {
  constructor(handler) {
    super(handler, 'Mouse', 'mouse.png');
  }
}

export default MouseController;
