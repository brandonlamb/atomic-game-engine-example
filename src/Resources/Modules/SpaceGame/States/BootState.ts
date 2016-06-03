import State from "../../Atomic/State/State";
import Game from "../../Atomic/Game";

/**
 * Boot state
 *
 * @class BootState
 * @augments State
 */
class BootState extends State {
  private ready:boolean = false;

  /**
   * @constructor
   * @param {string} key
   * @param {Game} game
   */
  constructor(key?:string, game?:Game) {
    super(key, game);
  }

  /**
   * @function BootState#preload
   * @inheritDoc
   * @override
   */
  preload() {
    this.debug('BootState.preload()');

    super.preload();

    this.ready = true;
  }

  /**
   * @function BootState#create
   * @inheritDoc
   * @override
   */
  create():void {
    this.debug('BootState.create()');
    super.create();
  }

  /**
   * @function BootState#update
   * @inheritDoc
   * @override
   */
  update(game:Game, timeStep:number):void {
    this.debug('BootState.update(): timeStep=' + timeStep.toPrecision(10));
    super.update(game, timeStep);

    if (this.ready === true) {
      this.stateManager.start('Preload');
    }
  }
}

export default BootState;
