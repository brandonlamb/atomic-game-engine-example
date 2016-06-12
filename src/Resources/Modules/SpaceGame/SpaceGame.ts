import GameConfig from "../Atomic/GameConfig";
import Generic2DGame from "../Atomic/Generic2DGame";
import LocalStorage from "../Atomic/Persistence/LocalStorage";
import BootState from "./States/BootState";
import PreloadState from "./States/PreloadState";
import MainMenuState from "./States/MainMenuState";
import XMLFile = Atomic.XMLFile;

/**
 * @class SpaceGame
 * @augments Generic2DGame
 * @augments Game
 */
class SpaceGame extends Generic2DGame {
  storage:LocalStorage = new LocalStorage();
  halfWidth:number;
  halfHeight:number;

  /**
   * @constructor
   * @param {GameConfig} config
   */
  constructor(config?:GameConfig) {
    super(config);
  }

  /**
   * @inheritDoc
   * @override
   */
  createScene2D(filename:string):Atomic.Scene {
    let scene:Atomic.Scene = super.createScene2D(filename);

    /*
    let renderPath:string = 'Data/SpaceGame/RenderPath.xml';
    let filesystem:Atomic.FileSystem = Atomic.fileSystem;
    let file:Atomic.File = null;
    let dirs:Array<string> = this.cache.getResourceDirs();

    dirs.forEach(function (i) {
      if (filesystem.fileExists(i + '/' + renderPath)) {
        file = new Atomic.File(
          i + '/' + renderPath,
          Atomic.FILE_READ
        );
      }
    });


    if (typeof file !== null) {
      let xmlFile:Atomic.XMLFile = new Atomic.XMLFile();
      xmlFile.fromString(file.readText());

      // let renderPath = this.cache.getResource('XMLFile', 'Data/RenderPath.xml');
      // this.viewport.setRenderPath(xmlFile);
    }
    */

    if (this.config.useRenderPath) {
      this.viewport.renderPath.append(
        <Atomic.XMLFile>this.cache.getResource('XMLFile', 'Data/SpaceGame/RenderPath.xml')
      );
    }

    if (this.config.blackAndWhite) {
      this.viewport.renderPath.append(
        <Atomic.XMLFile>this.cache.getResource('XMLFile', 'PostProcess/GreyScale.xml'));
    }

    if (this.config.blur) {
      this.viewport.renderPath.append(
        <Atomic.XMLFile>this.cache.getResource('XMLFile', 'PostProcess/Blur.xml')
      );
    }

    this.viewport.setDrawDebug(true);

    return scene;
  }

  /**
   * Play music
   * @function SpaceGame#playMusic
   * @inheritDoc
   * @override
   */
  playMusic(filename:string):void {
    this.debug('SpaceGame.playMusic(): filename=' + filename);
    if (!this.config.music) {
      return;
    }
    super.playMusic(filename);
  }

  /**
   * @inheritDoc
   * @override
   */
  start():void {
    this.debug('SpaceGame.start()');
    super.start();

    // this.halfWidth = this.graphics.width * Atomic.PIXEL_SIZE * 0.5;
    // this.halfHeight = this.graphics.height * Atomic.PIXEL_SIZE * 0.5;
    this.halfWidth = this.graphics.width * Atomic.PIXEL_SIZE;
    this.halfHeight = this.graphics.height * Atomic.PIXEL_SIZE;

    // this.graphics.toggleFullscreen();
    // this.graphics.maximize();
    this.graphics.setWindowSize(this.config.width, this.config.height);

    // let size = this.graphics.getMonitorResolution(0);
    // this.graphics.setWindowSize(size[0] / 1.25, size[1] / 1.25);

    // this.graphics.centerWindow();
    // this.graphics.setWindowPosition(0, 0);

    // Atomic.print('MAX_FPS=' + this.engine.getMaxFps());
    // this.engine.setMinFps(30);
    // this.engine.setMaxFps(60);

    this.stateManager.add('Boot', new BootState());
    this.stateManager.add('Preload', new PreloadState());
    this.stateManager.add('MainMenu', new MainMenuState());

    this.stateManager.start('Boot');
  }
}

export default SpaceGame;
