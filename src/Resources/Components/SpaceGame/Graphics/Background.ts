'atomic component';

import SpaceGame from "../../../Modules/SpaceGame/SpaceGame";
import Console from "../../../Modules/Atomic/Console";

class Background extends Atomic.JSComponent {

  private debug:Function = Console.debug;
  // private debug:Function = Atomic.print;
  private game:SpaceGame = Atomic.game;
  background:string = 'Sprites/SpaceGame/space_background.png';

  inspectorFields = {
    background: [Atomic.VAR_STRING, '']
  };

  /**
   * @function Background#start
   * @inheritDoc
   * @override
   */
  start():void {
    this.debug('Background.start(): background=' + this.background);

    // this.node.scale2D = [1.5, 1.5];
    // this.node.position2D = [0, 12];

    if (this.background.length > 1) {
      this.createBackground();
    }
  }

  /**
   * Add background node
   * @function Background#createBackground
   */
  createBackground():void {
    this.debug('Background.createBackground(): background=' + this.background);

    let sprite = <Atomic.Sprite2D>this.game.cache.getResource(
      'Sprite2D',
      this.background
    );

    // add a sprite component to our node
    let sprite2D = <Atomic.StaticSprite2D>this.node.createComponent('StaticSprite2D');

    sprite2D.orderInLayer = -100;
    sprite2D.blendMode = Atomic.BLEND_ADDALPHA;
    sprite2D.sprite = sprite;
  }

  /**
   * @function Background#update
   * @inheritDoc
   * @override
   */
  update(timeStep:number):void {
    this.debug('Background.update(): position[1]=' + this.node.position[1]);

    if (this.node.position[1] < -19) {
      this.debug('Background.update(): HIT');
      this.node.position2D = [0, 18];
    }

    this.node.translate([0, -timeStep * .25, 0]);
  }
}

export = Background;
