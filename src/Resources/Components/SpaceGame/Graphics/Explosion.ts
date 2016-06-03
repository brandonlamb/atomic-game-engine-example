'atomic component';

import SpaceGame from "../../../Modules/SpaceGame/SpaceGame";
import Console from "../../../Modules/Atomic/Console";

class Explosion extends Atomic.JSComponent {
  inspectionFields = {
    frame: [Atomic.VAR_INT, 0],
    frameTime: [Atomic.VAR_INT, 0]
  };

  frame:number;
  frameTime:number;
  spawnPosition:number;

  private debug:Function = Console.debug;
  private game:SpaceGame = Atomic.game;
  // private input:Atomic.Input = null;
  private spritesheet:Atomic.SpriteSheet2D;
  private boomSound:Atomic.Sound;
  private soundSource:Atomic.SoundSource;
  private sprite2D:Atomic.StaticSprite2D;
  private sprites:Array<Atomic.Sprite2D>;

  /**
   * @function Explosion#start
   * @inheritDoc
   * @override
   */
  start():void {
    this.spritesheet = this.game.getSpriteSheet2D(
      'Sprites/SpaceGame/Effects/explosions_sheet.xml'
    );

    this.boomSound = this.game.getSound(
      'Sounds/SpaceGame/boom' + Math.round(Math.random()) + '.wav'
    );

    this.frame = 0;
    this.frameTime = 0;
    this.sprites = [];

    let i = Math.round(Math.random() * 7);

    for (let j = 0; j < 16; j++) {
      this.sprites.push(this.spritesheet.getSprite(i + '_' + j));
    }

    // add a sprite component to our node
    this.sprite2D = <Atomic.StaticSprite2D>this.node.createComponent('StaticSprite2D');
    this.sprite2D.blendMode = Atomic.BLEND_ADDALPHA;
    this.sprite2D.sprite = this.sprites[0];
    this.node.position2D = this.spawnPosition;
    this.node.scale2D = [1.5, 1.5];
    this.sprite2D.orderInLayer = 200;

    this.soundSource = <Atomic.SoundSource>this.node.createComponent('SoundSource');
    this.soundSource.soundType = Atomic.SOUND_EFFECT;
    // this.soundSource.gain;

    this.soundSource.play(this.boomSound);

  }

  /**
   * @function Explosion#update
   * @inheritDoc
   * @override
   */
  update(timeStep:number):void {
    this.frameTime += timeStep;

    if (this.frameTime < .05) {
      return;
    }

    this.frameTime = 0;
    this.frame++;

    if (this.frame == 16) {
      Atomic.destroy(this.node);
      return;
    }

    this.sprite2D.sprite = this.sprites[this.frame];
  }
}

export = Explosion;
