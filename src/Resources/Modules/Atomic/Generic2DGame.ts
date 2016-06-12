import GameConfig from "./GameConfig";
import Console from "../Atomic/Console";
import StateManager from "./State/StateManager";
import Game from "./Game";

const CAMERA_POSITION_Z = -10.0;

class Generic2DGame implements Game {
  debug:Function = Console.debug;
  engine:Atomic.Engine = Atomic.getEngine();
  cache:Atomic.ResourceCache = Atomic.getResourceCache();
  renderer:Atomic.Renderer = Atomic.getRenderer();
  graphics:Atomic.Graphics = Atomic.getGraphics();
  input:Atomic.Input = Atomic.getInput();
  uiView:Atomic.UIView = new Atomic.UIView();
  scene:Atomic.Scene = null;
  cameraNode:Atomic.Node = null;
  camera:Atomic.Component = null;
  sound:Atomic.Sound = null;
  viewport:Atomic.Viewport = null;

  config:GameConfig = null;
  stateManager:StateManager = new StateManager(this);

  ready:boolean = false;
  booted:boolean = false;
  running:boolean = false;

  /**
   * @constructor
   * @param {GameConfig} config
   */
  constructor(config?:GameConfig) {
    this.config = config;
    this.input.setMouseVisible(true);

    if (Atomic.platform == 'Android') {
      this.renderer.reuseShadowMaps = false;
      this.renderer.shadowQuality = Atomic.SHADOWQUALITY_LOW_16BIT;
    }
  }

  /**
   * @inheritDoc
   * @override
   */
  createScene2D(filename:string):Atomic.Scene {
    this.debug('Generic2DGame.createScene2D(): filename=' + filename);

    var scene, camera, cameraNode, viewport;

    if (this.scene) {
      this.scene.remove();
    }

    scene = new Atomic.Scene();

    if (typeof(filename) == 'string') {
      this.debug('Generic2DGame.createScene2D(): load=' + filename);

      scene.loadXML(filename);
      cameraNode = scene.getChild('Camera');
      // cameraNode = scene.getChild('Player').getChild('Camera');
      camera = cameraNode.getComponent('Camera');
    } else {
      this.debug('Generic2DGame.createScene2D(): create scene');

      scene.createComponent('Octree');

      cameraNode = scene.createChild('Camera');
      cameraNode.position = [0.0, 0.0, CAMERA_POSITION_Z];

      camera = cameraNode.createComponent('Camera');
      camera.orthographic = true;
      camera.orthoSize = this.graphics.height * Atomic.PIXEL_SIZE;
    }

    if (Atomic.editor) {
      viewport = Atomic.editor.setView(scene, camera);
    } else {
      this.debug('Generic2DGame.createScene2D(): create viewport');

      viewport = new Atomic.Viewport(scene, camera);
      this.renderer.setViewport(0, viewport);
    }

    this.scene = scene;
    this.cameraNode = cameraNode;
    this.camera = camera;
    this.viewport = viewport;

    return scene;
  }

  /**
   * @inheritDoc
   * @override
   */
  getSprite2D(filename:string):Atomic.Sprite2D {
    this.debug('Generic2DGame.getSprite2D(): filename=' + filename);
    return <Atomic.Sprite2D>this.cache.getResource('Sprite2D', filename);
  }

  /**
   * @inheritDoc
   * @override
   */
  getSpriteSheet2D(filename:string):Atomic.SpriteSheet2D {
    this.debug('Generic2DGame.getSpriteSheet2D(): filename=' + filename);
    return <Atomic.SpriteSheet2D>this.cache.getResource('SpriteSheet2D', filename);
  }

  /**
   * @inheritDoc
   * @override
   */
  getSound(filename:string):Atomic.Sound {
    this.debug('Generic2DGame.getSound(): filename=' + filename);
    return <Atomic.Sound>this.cache.getResource('Sound', filename);
  }

  /**
   * @inheritDoc
   * @override
   */
  update(timeStep:number):void {
    this.debug('Generic2DGame.update(): timeStep=' + timeStep.toPrecision(10));

    this.stateManager.preUpdate(timeStep);
    this.stateManager.update(timeStep);
    this.scene.update(timeStep);
  }

  /**
   * @inheritDoc
   * @override
   */
  init():void {
    this.debug('Generic2DGame.init()');
  }

  /**
   * @inheritDoc
   * @override
   */
  start():void {
    this.debug('Generic2DGame.start()');

    // this.graphics.setWindowSize(this.config.width, this.config.height);
    this.graphics.centerWindow();

    this.booted = true;
  }

  /**
   * @inheritDoc
   * @override
   */
  boot():void {
    this.debug('Generic2DGame.boot()');

    if (this.booted) {
      this.debug('Generic2DGame.boot(): already booted');
      return;
    }

    this.stateManager.boot();
  }

  /**
   * Play music
   * @function Generic2DGame#playMusic
   * @inheritDoc
   * @override
   */
  playMusic(filename:string):void {
    this.debug('Generic2DGame.playMusic(): ' + filename);

    const musicFile:any = this.getSound(filename);
    musicFile.looped = true;

    const musicNode:Atomic.Node = this.scene.createChild('MusicNode');
    const musicSource:Atomic.SoundSource = <Atomic.SoundSource>musicNode.createComponent(
      'SoundSource');

    // musicSource.gain = 0.5;
    musicSource.soundType = Atomic.SOUND_MUSIC;
    // musicSource.setSoundType('Music');
    musicSource.play(musicFile);
  }

  /**
   * @function Generic2DGame#random
   * @inheritDoc
   * @override
   */
  random(min:number, max:number):number {
    return Math.random() * (max - min) + min;
  }

  /**
   * @function Generic2DGame#cleanup
   * @inheritDoc
   * @override
   */
  cleanup():void {
    if (Atomic.platform == 'Android' || Atomic.platform == 'iOS') {
      // remove dpad
      // Atomic.game.dpad.remove();

      // remove fireButton
      // this.uiView.removeChild(this.fireButton);
    }

    this.renderer.setViewport(1, null);

    Atomic.destroy(this.scene);
  }
}

export default Generic2DGame;
