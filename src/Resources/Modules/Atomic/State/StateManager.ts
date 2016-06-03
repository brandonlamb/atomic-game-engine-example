import State from "./State";
import Console from "./../../Atomic/Console";
import Game from "./../../Atomic/Game";

/**
 * This is a base StateManager class which can be extended if you are creating your own game.
 * It provides quick access to common functions such as the camera, cache, input, match, sound and
 * more.
 *
 * @class StateManager
 */
class StateManager {
  private debug:Function = Console.debug;
  private game:Game = null;
  private pendingStateKey:string = null;
  private currentStateKey:string = null;
  private states:Object = {};
  private created:boolean = false;
  private clearWorld:boolean = true;
  private clearCache:boolean = true;
  private args:Array<Object> = [];
  private callbackContext:State = null;
  private onInitCallback:Function = null;
  private onShutdownCallback:Function = null;
  private onPreloadCallback:Function = null;
  private onLoadUpdateCallback:Function = null;
  private onCreateCallback:Function = null;
  private onUpdateCallback:Function = null;
  private onPausedCallback:Function = null;
  private onResumedCallback:Function = null;
  private onPauseUpdateCallback:Function = null;
  // private onLoadRenderCallback:Function = null;
  // private onRenderCallback:Function = null;

  /**
   * Constructor
   * @param {Game} game
   */
  constructor(game:Game) {
    this.game = game;
  }

  /**
   * The Boot handler is called by Game when it first starts up.
   * @function StateManager#boot
   * @returns {StateManager}
   */
  boot():StateManager {
    this.debug('StateManager.boot()');

    // this.game.onPause.add(this.pause, this);
    // this.game.onResume.add(this.resume, this);

    if (this.pendingStateKey !== null && typeof this.pendingStateKey !== 'string') {
      this.add('default', this.pendingStateKey, true);
    }

    return this;
  }

  /**
   * Adds a new State into the StateManager. You must give each State a unique key by which you'll
   * identify it. The State can be either a State object (or an object that extends it), a
   * plain JavaScript object or a function. If a function is given a new state object will be
   * created by calling it.
   *
   * @function StateManager#add
   * @param {string} key - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
   * @param {State|object|function} state  - The state you want to switch to.
   * @param {boolean} [autoStart=false]  - If true the State will be started immediately after
   *   adding it.
   * @returns {State}
   */
  add(key:string, state:Object, autoStart:boolean = false):State {
    this.debug('StateManager.add(): key=' + key);

    if (state instanceof State) {
      this.states[key] = state;
    } else if (typeof state === 'object') {
      this.states[key] = state;
      this.states[key].game = this.game;
    } else if (typeof state === 'function') {
      this.states[key] = Object.create(state, {key: key, game: this.game});
    }

    if (autoStart) {
      this.start(key);
    }

    return this.states[key];
  }

  /**
   * Delete the given state.
   * @function StateManager#remove
   * @param {string} key - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
   * @returns {StateManager}
   */
  remove(key:string):StateManager {
    this.debug('StateManager.remove(): key=' + key);

    if (this.currentStateKey === key) {
      this.callbackContext = null;
      this.onInitCallback = null;
      this.onShutdownCallback = null;
      this.onPreloadCallback = null;
      this.onLoadUpdateCallback = null;
      this.onCreateCallback = null;
      this.onUpdateCallback = null;
      this.onPausedCallback = null;
      this.onResumedCallback = null;
      this.onPauseUpdateCallback = null;
      // this.onRenderCallback = null;
      // this.onLoadRenderCallback = null;
      // this.onPreRenderCallback = null;
      // this.onResizeCallback = null;
    }

    delete this.states[key];

    return this;
  }

  /**
   * Start the given State. If a State is already running then State.shutDown will be called (if it
   * exists) before switching to the new State.
   *
   * @function StateManager#start
   * @param {string} key - The key of the state you want to start.
   * @param {boolean} [clearWorld=true] - Clear everything in the world? This clears the World
   *   display list fully (but not the Stage, so if you've added your own objects to the Stage they
   *   will need managing directly)
   * @param {boolean} [clearCache=false] - Clear the Game.Cache? This purges out all loaded assets.
   *   The default is false and you must have clearWorld=true if you want to clearCache as well.
   * @param {...*} args - Additional parameters that will be passed to the State.init function
   *   (if it has one).
   * @returns {StateManager}
   */
  start(key:string,
        clearWorld:boolean = true,
        clearCache:boolean = true,
        ...args:any[]):StateManager {
    const ARG_COUNT = 3;

    this.debug('StateManager.start(): key=' + key);

    if (this.checkState(key)) {
      //  Place the state in the queue. It will be started the next time the game loop begins.
      this.pendingStateKey = key;
      this.clearWorld = clearWorld;
      this.clearCache = clearCache;

      if (arguments.length > ARG_COUNT) {
        this.args = Array.prototype.splice.call(arguments, ARG_COUNT);
      }
    }

    return this;
  }

  /**
   * Checks if a given phaser state is valid. A State is considered valid if it has at least one of
   * the core functions: preload, create, update or render.
   *
   * @function StateManager#checkState
   * @param {string} key - The key of the state you want to check.
   * @return {boolean} true if the State has the required functions, otherwise false.
   */
  checkState(key:string):boolean {
    this.debug('StateManager.checkState(): key=' + key);

    if (typeof this.states[key] === 'undefined' || this.states[key] === null) {
      this.debug('StateManager - No state found with the key: ' + key);
      return false;
    }

    if (this.states[key].preload || this.states[key].create || this.states[key].update
        || this.states[key].render) {
      return true;
    }

    this.debug(
      'Invalid Atomic State object given. Must contain at least a one of the required functions: preload, create, update or render'
    );

    return false;
  }

  /**
   * This method clears the current State, calling its shutdown callback. The process also removes
   * any active tweens, resets the camera, resets input, clears physics, removes timers and if set
   * clears the world and cache too.
   *
   * @function StateManager#clearCurrentState
   * @returns {StateManager}
   */
  clearCurrentState():StateManager {
    this.debug('StateManager.clearCurrentState()');

    if (this.currentStateKey) {
      if (this.onShutdownCallback) {
        this.onShutdownCallback.call(this.callbackContext, this.game);
      }

      // this.game.tweens.removeAll();
      // this.game.camera.reset();
      // this.game.input.reset(true);
      // this.game.physics.clear();
      // this.game.time.removeAll();
      // this.game.scale.reset(this.clearWorld);

      if (this.clearWorld && this.clearCache === true) {
        this.game.cache.releaseAllResources(true);
      }
    }

    return this;
  }

  /**
   * Sets the current State. Should not be called directly (use StateManager.start)
   *
   * @function StateManager#setCurrentState
   * @param {string} key - State key.
   * @returns {StateManager}
   */
  setCurrentState(key:string):StateManager {
    this.debug('StateManager.setCurrentState(): key=' + key);

    this.callbackContext = this.states[key];

    this.link(key);

    //  Used when the state is set as being the current active state
    this.onCreateCallback = this.states[key].create || null;
    this.onInitCallback = this.states[key].init || this.dummy;
    this.onPausedCallback = this.states[key].paused || null;
    this.onPauseUpdateCallback = this.states[key].pauseUpdate || null;
    this.onPreloadCallback = this.states[key].preload || null;
    this.onResumedCallback = this.states[key].resumed || null;
    this.onUpdateCallback = this.states[key].update || null;
    this.onShutdownCallback = this.states[key].shutdown || this.dummy;
    // this.onRenderCallback = this.states[key].render || null;
    // this.onLoadRenderCallback = this.states[key].loadRender || null;
    // this.onPreRenderCallback = this.states[key].preRender || null;
    // this.onResizeCallback = this.states[key].resize || null;
    //  Used when the state is no longer the current active state

    this.currentStateKey = key;
    this.created = false;

    //  At this point key and pendingStateKey should equal each other
    this.onInitCallback.apply(this.callbackContext, this.args);

    //  If they no longer do then the init callback hit StateManager.start
    if (key === this.pendingStateKey) {
      this.args = [];
    }

    return this;
  }

  /**
   * Gets the current State.
   *
   * @function StateManager#getCurrentState
   * @returns {State}
   */
  getCurrentState():State {
    return this.getState(this.currentStateKey);
  }

  /**
   * Gets the State by key.
   *
   * @function StateManager#getState
   * @param {string} key
   * @returns {State}
   */
  getState(key:string):State {
    return this.states[key];
  }

  /**
   * Links game properties to the State given by the key.
   *
   * @function StateManager#link
   * @param {string} key - State key.
   * @returns {StateManager}
   */
  link(key:string):StateManager {
    this.debug('StateManager.link(): key=' + key);

    if (!this.states[key]) {
      throw new Error('State ' + key + ' does not exist');
    }

    this.states[key].cache = this.game.cache;
    this.states[key].camera = this.game.camera;
    this.states[key].game = this.game;
    this.states[key].input = this.game.input;
    this.states[key].key = key;
    this.states[key].sound = this.game.sound;
    this.states[key].stateManager = this;

    return this;
  }

  /**
   * Nulls all State level Atomic properties, including a reference to Game.
   *
   * @function StateManager#unlink
   * @param {string} key - State key.
   * @returns {StateManager}
   */
  unlink(key:string):StateManager {
    this.debug('StateManager.unlink(): key=' + key);

    if (!this.states[key]) {
      throw new Error('State ' + key + ' does not exist');
    }

    this.states[key].cache = null;
    this.states[key].camera = null;
    this.states[key].game = null;
    this.states[key].input = null;
    this.states[key].sound = null;
    this.states[key].stateManager = null;

    return this;
  }

  /**
   * Used by onInit and onShutdown when those functions don't exist on the state
   * @function StateManager#dummy
   */
  dummy():StateManager {
    return this;
  }

  /**
   * Removes all StateManager callback references to the State object, nulls the game reference and
   * clears the States object. You don't recover from this without rebuilding the Atomic instance
   * again.
   * @function StateManager#destroy
   * @returns {StateManager}
   */
  destroy():StateManager {
    this.debug('StateManager.destroy()');

    this.clearCurrentState();
    this.callbackContext = null;
    this.onInitCallback = null;
    this.onShutdownCallback = null;
    this.onPreloadCallback = null;
    this.onLoadUpdateCallback = null;
    this.onCreateCallback = null;
    this.onUpdateCallback = null;
    this.onPausedCallback = null;
    this.onResumedCallback = null;
    this.onPauseUpdateCallback = null;
    this.game = null;
    this.states = {};
    this.pendingStateKey = null;
    this.currentStateKey = '';

    return this;
  }

  /**
   * preUpdate is called right at the start of the game loop. It is responsible for changing to a
   * new state that was requested previously.
   *
   * @function StateManager#preUpdate
   * @param {number} timeStep
   * @returns {StateManager}
   */
  preUpdate(timeStep:number):StateManager {
    this.debug(
      'StateManager.preUpdate(): pendingStateKey=' + this.pendingStateKey + ','
      + 'timeStep=' + timeStep.toPrecision(10)
    );

    if (this.pendingStateKey && this.game.booted) {
      //  Already got a state running?
      this.clearCurrentState();
      this.setCurrentState(this.pendingStateKey);

      if (this.currentStateKey !== this.pendingStateKey) {
        return this;
      } else {
        this.pendingStateKey = null;
      }

      //  If StateManager.start has been called from the init of a State that ALSO has a preload,
      // then onPreloadCallback will be set, but must be ignored
      if (this.onPreloadCallback) {
        this.onPreloadCallback.call(this.callbackContext, this.game, timeStep);
        this.loadComplete();
      } else {
        //  No init? Then there was nothing to load either
        this.loadComplete();
      }
    }

    return this;
  }

  /**
   * @function StateManager#loadComplete
   * @protected
   * @returns {StateManager}
   */
  loadComplete():StateManager {
    this.debug('StateManager.loadComplete()');

    if (this.created === false && this.onCreateCallback) {
      this.onCreateCallback.call(this.callbackContext);
    }

    this.created = true;

    return this;
  }

  /**
   * @function StateManager#pause
   * @returns {StateManager}
   */
  pause():StateManager {
    if (this.created && this.onPausedCallback) {
      this.onPausedCallback.call(this.callbackContext);
    }

    return this;
  }

  /**
   * @function StateManager#resume
   * @returns {StateManager}
   */
  resume():StateManager {
    if (this.created && this.onResumedCallback) {
      this.onResumedCallback.call(this.callbackContext);
    }
    return this;
  }

  /**
   * @function StateManager#update
   * @param {number} timeStep
   * @returns {StateManager}
   */
  update(timeStep:number):StateManager {
    this.debug('StateManager.update(): timeStep=' + timeStep.toPrecision(10) + ', currentStateKey='
               + this.currentStateKey);

    if (this.created) {
      if (this.onUpdateCallback) {
        this.onUpdateCallback.call(this.callbackContext, this.game, timeStep);
      }
    } else {
      if (this.onLoadUpdateCallback) {
        this.onLoadUpdateCallback.call(this.callbackContext, this.game, timeStep);
      }
    }

    return this;
  }

  /**
   * @function StateManager#pauseUpdate
   * @returns {StateManager}
   */
  pauseUpdate():StateManager {
    if (this.created) {
      if (this.onPauseUpdateCallback) {
        this.onPauseUpdateCallback.call(this.callbackContext);
      }
    } else {
      if (this.onLoadUpdateCallback) {
        this.onLoadUpdateCallback.call(this.callbackContext);
      }
    }

    return this;
  }
}

export default StateManager;
