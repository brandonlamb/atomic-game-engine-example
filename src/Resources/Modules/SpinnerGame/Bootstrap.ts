import Console from "../Atomic/Console";
import Game from "../Atomic/Game";
import GameConfig from "../Atomic/GameConfig";
import SpinnerGame from "./SpinnerGame";

class Bootstrap {
  private debug:Function = Console.debug;
  private game:Game = null;

  /**
   * @constructor
   * @param {GameConfig} config
   */
  constructor(config:GameConfig) {
    Console.DEBUG = config.debug;
    this.game = new SpinnerGame(config);
  }

  /**
   * @function Bootstrap#init
   * @returns {Bootstrap}
   */
  init():void {
    this.game.init();
  }

  /**
   * @function Bootstrap#start
   * @returns {Bootstrap}
   */
  start():void {
    this.debug('main.start()');

    this.game.boot();
    this.game.start();
  }

  /**
   * @function Bootstrap#update
   * @param {number} timeStep
   */
  update(timeStep:number):void {
    this.debug('Bootstrap.update(): timeStep=' + timeStep.toPrecision(10));
    this.game.update(timeStep);
  }
}

export default Bootstrap;
