import State from "../../Atomic/State/State";
import Game from "../../Atomic/Game";

/**
 * Main menu state
 *
 * @class MainMenuState
 * @augments State
 */
class MainMenuState extends State {
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
   * @function MainMenuState#preload
   * @inheritDoc
   * @override
   */
  preload():void {
    this.debug('MainMenuState.preload()');

    super.preload();

    this.debug('MainMenuState.preload(): load Scenes/SpinnerGame/Scene01');
    this.game.createScene2D('Scenes/SpinnerGame/Scene01.scene');
    // game.cameraNode.position = [0, -.5, -8];

    this.ready = true;
  }

  /**
   * @function MainMenuState#create
   * @inheritDoc
   * @override
   */
  create():void {
    this.debug('MainMenuState.create()');

    super.create();

    this.game.playMusic('Music/SpinnerGame/battle.ogg');
  }

  /**
   * @function MainMenuState#update
   * @inheritDoc
   * @override
   */
  update(game:Game, timeStep:number):void {
    this.debug('MainMenuState.update(): timeStep=' + timeStep.toPrecision(10));
    super.update(game, timeStep);

    if (this.ready === true) {
    }
  }
}

export default MainMenuState;
