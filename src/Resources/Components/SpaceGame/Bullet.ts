'atomic component';

import Vector2 = Atomic.Vector2;
import SpaceGame from "../../Modules/SpaceGame/SpaceGame";
import Console from "../../Modules/Atomic/Console";

class Bullet extends Atomic.JSComponent {
  private debug:Function = Console.debug;
  private game:SpaceGame = Atomic.game;
  private isPlayer:boolean = false;
  private player:Atomic.Node;
  private initPos:Vector2;
  private initRot:number;

  constructor() {
    super();
    this.player = this.game.scene.getChild('Player');
  }

  init(isPlayer:boolean, spawnPosition:Vector2, rotation2D:number):void {
    this.isPlayer = isPlayer;

    this.initPos = this.player.position2D;
    this.initRot = this.player.rotation2D;

    // let laserSound = game.getSound(this.isPlayer ? 'Sounds/laser01.wav' : 'Sounds/laser02.wav');
    let sprite2D = <Atomic.StaticSprite2D>this.node.createComponent('StaticSprite2D');

    if (this.isPlayer) {
      sprite2D.sprite = this.game.getSprite2D('Sprites/SpaceGame/Effects/blue_beam.png');
    } else {
      sprite2D.sprite = this.game.getSprite2D('Sprites/SpaceGame/Effects/green_beam.png');
    }

    sprite2D.blendMode = Atomic.BLEND_ADDALPHA;

    // this.soundSource = node.createComponent('SoundSource');
    // this.soundSource.soundType = Atomic.SOUND_EFFECT;
    // this.soundSource.gain = 0.75;
    // this.soundSource.play(laserSound);

    this.node.position2D = spawnPosition;
    this.node.rotation2D = rotation2D;

    // if (!this.isPlayer) {
    //   this.node.roll(180);
    // }
  }

  /**
   * @function Bullet:upadte
   * @inheritDoc
   * @override
   */
  update(timeStep:number):void {
    // if (!SpaceGame) {
    //   Atomic.destroy(node);
    //   return;
    // }

    // let speed = this.isPlayer ? 8 : 5;
    let speed = this.isPlayer ? 2 : 1;
    speed *= timeStep;

    let x = this.initPos[0] + speed * Math.cos(this.node.rotation2D * Math.PI / 180);
    let y = this.initPos[1] + speed * Math.sin(this.node.rotation2D * Math.PI / 180);

    // this.node.translate2D([0, speed]);
    this.node.translate2D([x, y]);

    if (this.isPlayer) {
      if (this.updatePlayerBullet()) {
        Atomic.destroy(this.node);
      }
    } else {
      // if (updateEnemyBullet()) {
      //   Atomic.destroy(this.node);
      // }
    }
  }

  updatePlayerBullet():boolean {
    let camera = <Atomic.Camera>this.game.camera;
    let bpos = this.node.position2D;

    // off the top of the screen
    if (bpos[1] > 10) {
      return true;
    }

    // for (var i = 0; i < SpaceGame.enemies.length; i++) {
    //   var enemy = SpaceGame.enemies[i];
    //   var epos = enemy.node.worldPosition2D;
    //
    //   if (Math.abs(epos[0] - bpos[0]) < 0.25 &&
    //     Math.abs(epos[1] - bpos[1]) < 0.25) {
    //
    //     enemy.onHit();
    //     return true;
    //   }
    // }

    // if (SpaceGame.capitalShip) {
    //   var epos = SpaceGame.capitalShip.node.worldPosition2D;
    //
    //   if (Math.abs(epos[0] - bpos[0]) < 0.75 &&
    //     Math.abs(epos[1] - bpos[1]) < 0.75) {
    //     SpaceGame.capitalShip.onHit(bpos);
    //     return true;
    //   }
    // }
  }
}

export = Bullet;
