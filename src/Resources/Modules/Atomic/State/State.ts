import StateManager from "./StateManager";
import Game from "./../Game";
import Console from "./../Console";

/**
 * This is a base State class which can be extended if you are creating your own game.
 * It provides quick access to common functions such as the camera, cache, input, match, sound and
 * more.
 *
 * @class State
 */
class State {
  debug:Function = Console.debug;
  cache:Atomic.ResourceCache = null;
  camera:Atomic.Component = null;
  game:Game = null;
  input:Atomic.Input = null;
  key:string = null;
  stateManager:StateManager = null;
  sound:Atomic.Sound = null;

  constructor(key?:string, game?:Game) {
    this.key = key;
    this.game = game;
  }

  /**
   * create is called once preload has completed, this includes the loading of any assets from the
   * Loader. If you don't have a preload method then create is the first method called in your
   * State.
   *
   * @function State#create
   */
  create():void {
  }

  /**
   * init is the very first function called when your State starts up. It's called before preload,
   * create or anything else. If you need to route the game away to another State you could do so
   * here, or if you need to prepare a set of variables or objects before the preloading starts.
   *
   * @function State#init
   */
  init():void {
  }

  /**
   * This method will be called if the core game loop is paused.
   *
   * @function State#paused
   */
  paused():void {
  }

  /**
   * pauseUpdate is called while the game is paused instead of preUpdate, update and postUpdate.
   *
   * @function State#pauseUpdate
   */
  pauseUpdate():void {
  }

  /**
   * preload is called first. Normally you'd use this to load your game assets (or those needed for
   * the current State) You shouldn't create any objects in this method that require assets that
   * you're also loading in this method, as they won't yet be available.
   *
   * @function State#preload
   */
  preload():void {
  }

  /**
   * This method will be called when the core game loop resumes from a paused state.
   *
   * @function State#resumed
   */
  resumed():void {
  }

  /**
   * The update method is left empty for your own use.
   * It is called during the core game loop AFTER debug, physics, plugins and the Stage have had
   * their preUpdate methods called. If is called BEFORE Stage, Tweens, Sounds, Input, Physics,
   * Particles and Plugins have had their postUpdate methods called.
   *
   * @function State#update
   * @param {Game} game
   * @param {number} timeStep
   */
  update(game:Game, timeStep:number):void {
  }

  /**
   * This method will be called when the State is shutdown (i.e. you switch to another state from
   * this one).
   *
   * @function State#shutdown
   */
  shutdown():void {
  }
}

export default State;
