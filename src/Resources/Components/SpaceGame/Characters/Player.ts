'atomic component';

import Vector2 = Atomic.Vector2;
import SpaceGame from '../../../Modules/SpaceGame/SpaceGame';
import Console from '../../../Modules/Atomic/Console';

class Player extends Atomic.JSComponent {
  inspectorFields = {
    health: [Atomic.VAR_INT, 0],
    armor: [Atomic.VAR_INT, 0],
    allowMove: [Atomic.VAR_BOOL, true],
    allowShoot: [Atomic.VAR_BOOL, true],
    allowZoom: [Atomic.VAR_BOOL, true]
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
  allowZoom:boolean = true;
  health:number = 10;
  armor:number = 10;

  private body:Atomic.RigidBody2D = null;
  contactCount:number = 0;

  /**
   * @function Player:start
   * @inheritDoc
   * @override
   */
  start():void {
    // this.lastUpdate = Date.now();
    this.input = this.game.input;

    let spaceSheet = this.game.getSpriteSheet2D('Sprites/SpaceGame/Ships/spacegame_sheet.xml');
    let sprite2D = <Atomic.StaticSprite2D>this.node.createComponent('StaticSprite2D');
    sprite2D.sprite = spaceSheet.getSprite('spaceship_mantis');
    sprite2D.blendMode = Atomic.BLEND_ALPHA;

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
    };

    this.body = <Atomic.RigidBody2D>this.node.getComponent('RigidBody2D');

    this.subscribeToEvent('PhysicsBeginContact2D', function(event) {
      //if bodyB is our body, so increment contactCount
      if (event.bodyB == this.body)
        this.contactCount++;
    });
    //subscribe to
    this.subscribeToEvent('PhysicsEndContact2D', function(event) {
      //if bodyB is our body, so decrement contactCount
      if (event.bodyB == this.body)
        this.contactCount--;
    });
  }

  /**
   * Handle player hit
   * @function Player:onHit
   */
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
    if (!i.getKeyDown(Atomic.KEY_SPACE)) {
      return;
    }

    this.shootDelta = 0.15;

    let pos = this.node.position2D;
    pos[1] += 0.5;

    Atomic.print('SHOOT');

    this.spawnBullet(pos, true);
  }

  moveShip(timeStep:number):void {
    let config = this.game.config;
    let camera = <Atomic.Camera>this.game.camera;
    let cameraNode:Atomic.Node = <Atomic.Node>camera.getNode();
    let speed = 2.0 * timeStep;
    let rotationSpeed = 0.4;
    let pos = this.node.position2D;
    let rot = this.node.rotation2D;

    const i = this.input;
    let left = i.getKeyDown(Atomic.KEY_LEFT) || i.getKeyDown(Atomic.KEY_A);
    let right = i.getKeyDown(Atomic.KEY_RIGHT) || i.getKeyDown(Atomic.KEY_D);
    let up = i.getKeyDown(Atomic.KEY_UP) || i.getKeyDown(Atomic.KEY_W);
    let down = i.getKeyDown(Atomic.KEY_DOWN) || i.getKeyDown(Atomic.KEY_S);
    let shoot = i.getKeyDown(Atomic.KEY_SPACE);

    // left/right to rotate
    if (left) {
      this.node.rotate2D(rotationSpeed);
    }

    if (right) {
      this.node.rotate2D(-rotationSpeed);
    }

    // Up for thrust
    if (up) {
      let levelX = config.levelWidth * Atomic.PIXEL_SIZE;
      let levelY = config.levelHeight * Atomic.PIXEL_SIZE;
      let x = pos[0] + speed * Math.cos(rot * Math.PI / 180);
      let y = pos[1] + speed * Math.sin(rot * Math.PI / 180);

      if (x >= -levelX && x <= levelX) {
        pos[0] = x;
      }

      if (y >= -levelY && y <= levelY) {
        pos[1] = y;
      }
    }

    // Up for thrust
    if (down) {
      let levelX = config.levelWidth * Atomic.PIXEL_SIZE;
      let levelY = config.levelHeight * Atomic.PIXEL_SIZE;
      let x = pos[0] - speed * Math.cos(rot * Math.PI / 180);
      let y = pos[1] - speed * Math.sin(rot * Math.PI / 180);

      if (x >= -levelX && x <= levelX) {
        pos[0] = x;
      }

      if (y >= -levelY && y <= levelY) {
        pos[1] = y;
      }
    }

    this.node.position2D = pos;
    cameraNode.position2D = pos;
    // cameraNode.position = [pos[0], pos[1], cameraNode.position[2]];
  }

  /**
   * @function Player:update
   * @inheritDoc
   * @override
   */
  update(timeStep:number):void {
    if (this.allowShoot) {
      this.doShooting(timeStep);
    }

    if (this.allowMove) {
      this.moveShip(timeStep);
    }

    if (this.allowZoom) {
      this.zoom(timeStep);
    }
  }

  /**
   * Zoom the camera in or out
   * @function Player:zoom
   * @param {number} timeStep
   */
  private zoom(timeStep:number):void {
    const camera = <Atomic.Camera>this.game.camera;
    const i = this.input;
    const zoomIn = i.getKeyDown(Atomic.KEY_I);
    const zoomOut = i.getKeyDown(Atomic.KEY_O);

    if (zoomIn) {
      camera.zoom += timeStep;
    }

    if (zoomOut) {
      camera.zoom -= timeStep;
    }
  }

  private spawnBullet(pos:Atomic.Vector2, isPlayer:boolean):void {
    let bulletNode = this.game.scene.createChild('Bullet');
    let bullet = bulletNode.createJSComponent('Components/SpaceGame/Bullet.js');
    bullet.init(isPlayer, pos, this.node.rotation2D);
  }
}

export = Player;
