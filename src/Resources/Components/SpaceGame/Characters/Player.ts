import Vector2 = Atomic.Vector2;
'atomic component';

import SpaceGame from "../../../Modules/SpaceGame/SpaceGame";
import Console from "../../../Modules/Atomic/Console";
import GameConfig from "../../../Modules/Atomic/GameConfig";

class Player extends Atomic.JSComponent {
  inspectionFields = {
    health: [Atomic.VAR_INT, 0],
    armor: [Atomic.VAR_INT, 0],
    allowMove: [Atomic.VAR_BOOL, true],
    allowShoot: [Atomic.VAR_BOOL, true]
  };

  private debug:Function = Console.debug;
  private game:SpaceGame = Atomic.game;
  private input:Atomic.Input = null;
  private shootDelta:number = 0;
  private spawnPosition:Atomic.Vector2;
  private delta:number = 0;
  private movement:Object;
  // private lastUpdate:number;

  allowMove:boolean = true;
  allowShoot:boolean = true;
  health:number = 10;
  armor:number = 10;

  start():void {
    // this.lastUpdate = Date.now();
    this.input = this.game.input;

    let spaceSheet = this.game.getSpriteSheet2D('Sprites/SpaceGame/Ships/spacegame_sheet.xml');
    let sprite2D = <Atomic.StaticSprite2D>this.node.createComponent('StaticSprite2D');
    sprite2D.sprite = spaceSheet.getSprite('spaceship_mantis');
    sprite2D.blendMode = Atomic.BLEND_ALPHA;

    let height = this.game.graphics.height;

    // let half = -height + 1.0;
    // let half = -(height * Atomic.PIXEL_SIZE);
    let half = height * Atomic.PIXEL_SIZE * .5;
    // let half = height * .5;
    // let half = height / 2;

    // let y = height - 100;
    // let y = -half + .65;
    let y = 0;

    Atomic.print(
      'height=' + this.game.graphics.height,
      ', pixel_size=' + Atomic.PIXEL_SIZE,
      ', half=' + half,
      ', y=' + y
    );

    let camera = this.game.camera.node;
    let pos1:Atomic.Vector2 = camera.getWorldPosition2D();
    let pos2:Atomic.Vector2 = camera.getPosition2D();
    Atomic.print('worldX=', pos1[0], ', worldY=', pos1[1]);
    Atomic.print('cameraX=', pos2[0], ', cameraY=', pos2[1]);

    this.node.position2D = [0, y];
    this.spawnPosition = this.node.getPosition2D();

    this.movement = {
      cursor: {
        UP: this.input.getScancodeFromKey(Atomic.KEY_UP),
        DOWN: this.input.getScancodeFromKey(Atomic.KEY_DOWN),
        LEFT: this.input.getScancodeFromKey(Atomic.KEY_LEFT),
        RIGHT: this.input.getScancodeFromKey(Atomic.KEY_RIGHT)
      },
      UP: this.input.getScancodeFromKey(Atomic.KEY_W),
      DOWN: this.input.getScancodeFromKey(Atomic.KEY_S),
      LEFT: this.input.getScancodeFromKey(Atomic.KEY_A),
      RIGHT: this.input.getScancodeFromKey(Atomic.KEY_D)
    }
  }

  onHit():void {
    Atomic.print('Player.onHit()');

    const node = this.scene.createChild('Explosion');
    const explosion = node.createJSComponent('Components/SpaceGame/Graphics/Explosion.js', {
      spawnPosition: node.worldPosition2D
    });

    this.health--;

    // SpaceGame.hud.updateHealth(this.health);

    //if (this.health == 0) {
    //
    //  SpaceGame.lose();
    //
    //}
  }

  doShooting(timeStep:number):void {
    if (this.shootDelta > 0) {
      this.shootDelta -= timeStep;

      if (this.shootDelta < 0) {
        this.shootDelta = 0;
      }

      return;
    }

    const i:Atomic.Input = this.input;
    if (!i.getKeyDown(Atomic.KEY_W) && !i.getKeyDown(Atomic.KEY_UP) && !i.getKeyDown(Atomic.KEY_SPACE)) {
      return;
    }
    // if (!this.input.getKeyDown(Atomic.KEY_W) && !this.input.getKeyDown(Atomic.KEY_UP) && !this.input.getKeyDown(Atomic.KEY_SPACE)) {
    //   return;
    // }

    this.shootDelta = 0.15;

    let pos = this.node.position2D;
    pos[1] += .5;

    // SpaceGame.spawnBullet(pos, true);
  }

  moveShip(timeStep:number):void {
    let config:GameConfig = this.game.config;
    let camera:Atomic.Node = this.game.camera.node;
    let speed:number = 2.0 * timeStep;
    let rotationSpeed:number = 0.4;
    let pos:Atomic.Vector2 = this.node.position2D;
    let rot:number = this.node.getRotation2D();
    let rightPos:number;
    let leftPos:number;

    const i:Atomic.Input = this.input;
    let left:boolean = i.getKeyDown(Atomic.KEY_LEFT) || i.getKeyDown(Atomic.KEY_A);
    let right:boolean = i.getKeyDown(Atomic.KEY_RIGHT) || i.getKeyDown(Atomic.KEY_D);
    let up:boolean = i.getKeyDown(Atomic.KEY_UP) || i.getKeyDown(Atomic.KEY_W);
    let down:boolean = i.getKeyDown(Atomic.KEY_DOWN) || i.getKeyDown(Atomic.KEY_S);
    let shoot:boolean = i.getKeyDown(Atomic.KEY_SPACE);
    // let jump:boolean = i.getKeyDown(Atomic.KEY_UP) || i.getKeyDown(Atomic.KEY_SPACE) || i.getKeyDown(Atomic.KEY_W);

    // left/right to move
    /*
    if (left) {
      leftPos = pos[0] - speed;
      // if (leftPos >= -this.game.halfWidth + 1) {
      if (leftPos >= -config.levelWidth * Atomic.PIXEL_SIZE) {
        pos[0] = leftPos;
        camera.translate2D([-Atomic.PIXEL_SIZE, 0]);
      }
    }

    if (right) {
      rightPos = pos[0] + speed;
      // if (rightPos <= this.game.halfWidth - 1) {
      if (rightPos <= config.levelWidth * Atomic.PIXEL_SIZE) {
        pos[0] = rightPos;
        camera.translate2D([Atomic.PIXEL_SIZE, 0]);
      }
    }
    */

    // left/right to rotate
    if (left) {
      this.node.rotate2D(rotationSpeed);
    }

    if (right) {
      this.node.rotate2D(-rotationSpeed);
    }

    // Up for thrust
    if (up) {
      pos[0] += speed * Math.cos(rot * Math.PI / 180);
      pos[1] += speed * Math.sin(rot * Math.PI / 180);
    }

    // this.node.position2D = pos;
    this.node.setPosition2D(pos);

    // pos.y += -0.1;
    // camera.setPosition2D(pos);

    // let pos1:Atomic.Vector2 = camera.getWorldPosition2D();
    // let pos2:Atomic.Vector2 = camera.getPosition2D();
    // Atomic.print('worldX=', pos1[0], ', worldY=', pos1[1]);
    // Atomic.print('cameraX=', pos2[0], ', cameraY=', pos2[1]);

    // camera.setPosition2D(pos);
    // camera.translate2D(2, 0);
  }

  update(timeStep:number):void {
    if (this.allowShoot) {
      this.doShooting(timeStep);
    }

    if (this.allowMove) {
      this.moveShip(timeStep);
    }
  }
}

export = Player;
