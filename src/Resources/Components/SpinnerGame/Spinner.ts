'atomic component';

const ROTATION_YAW = 'yaw';
const ROTATION_ROLL = 'roll';

/**
 * A component that rotates a node
 * @class Spinner
 * @augments Atomic.JSComponent
 */
class Spinner extends Atomic.JSComponent {

  speed:number;
  rotateType:string;
  inspectorFields:Object;

  constructor() {
    super();

    this.inspectorFields = {
      speed: [Atomic.VAR_INT, 100],
      rotateType: [Atomic.VAR_STRING, 'roll']
    };
  }

  /**
   * Called every cycle.  The timestep will be the delta since the last time update was called
   * @param  {number} timeStep the delta time since the last time update was called
   */
  update(timeStep:number):void {
    switch (this.rotateType) {
      case ROTATION_ROLL:
        this.node.roll(timeStep * 75 * this.speed);
        break;

      case ROTATION_YAW:
        this.node.yaw(timeStep * 75 * this.speed);
        break;

      default:
        throw new Error('Rotation type ' + this.rotateType + ' is not valid');
    }
  }
}

export = Spinner;
