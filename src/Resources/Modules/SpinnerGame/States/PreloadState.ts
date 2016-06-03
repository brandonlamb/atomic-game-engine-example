import State from "../../Atomic/State/State";
import Game from "../../Atomic/Game";

/**
 * Preload state
 *
 * @class PreloadState
 * @augments State
 * @constructor
 */
class PreloadState extends State {
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
   * @function PreloadState#preload
   * @inheritDoc
   * @override
   */
  preload():void {
    this.debug('PreloadState.preload()');

    super.preload();

    this.cache.releaseAllResources();

    let self:PreloadState = this;
    let resources:Object = {
      'Music/SpinnerGame/battle.ogg': 'Sound',
      'Sound/SpinnerGame/boom0.ogg': 'Sound'
    };

    Object.keys(resources).forEach(function (key:string) {
      try {
        self.cache.getResource(resources[key], key);
        self.debug('Pre-caching: ' + resources[key] + ' ' + key);
      } catch (e) {
        self.debug('PreloadState.preload(): error=' + e);
      }
    });

    this.ready = true;
  }

  /**
   * @function PreloadState#update
   * @inheritDoc
   * @override
   */
  update(game:Game, timeStep:number):void {
    this.debug('PreloadState.update(): timeStep=' + timeStep.toPrecision(10));
    super.update(game, timeStep);

    // Once game music has decoded, load main menu
    //if (this.cache.isSoundDecoded('gameMusic') && this.ready === true) {
    if (this.ready === true) {
      this.stateManager.start('MainMenu');
    }
  }
}

export default PreloadState;
