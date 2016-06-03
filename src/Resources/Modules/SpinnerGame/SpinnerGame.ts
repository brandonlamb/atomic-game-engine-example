import GameConfig from "../Atomic/GameConfig";
import Generic2DGame from "../Atomic/Generic2DGame";
import BootState from "./States/BootState";
import PreloadState from "./States/PreloadState";
import MainMenuState from "./States/MainMenuState";

/**
 * @class SpinnerGame
 * @augments Generic2DGame
 * @augments Game
 */
class SpinnerGame extends Generic2DGame {
  /**
   * @constructor
   * @param {GameConfig} config
   */
  constructor(config:GameConfig) {
    super(config);
  }

  playMusic(filename) {
    const musicFile:any = this.getSound(filename);
    musicFile.looped = true;

    const musicNode:Atomic.Node = this.scene.createChild('MusicNode');
    const musicSource:Atomic.SoundSource = <Atomic.SoundSource>musicNode.createComponent(
      'SoundSource');

    musicSource.gain = 0.5;
    // musicSource.soundType = Atomic.SOUND_MUSIC;
    musicSource.setSoundType('Music');
    musicSource.play(musicFile);
  }

  /**
   * @inheritDoc
   * @override
   */
  start():void {
    this.debug('SpinnerGame.start()');
    super.start();

    this.stateManager.add('Boot', new BootState());
    this.stateManager.add('Preload', new PreloadState());
    this.stateManager.add('MainMenu', new MainMenuState());

    this.stateManager.start('Boot');
  }
}

export default SpinnerGame;
