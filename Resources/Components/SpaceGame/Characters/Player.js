'atomic component';
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Console_1 = require('../../../Modules/Atomic/Console');
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        _super.apply(this, arguments);
        this.inspectorFields = {
            health: [Atomic.VAR_INT, 0],
            armor: [Atomic.VAR_INT, 0],
            allowMove: [Atomic.VAR_BOOL, true],
            allowShoot: [Atomic.VAR_BOOL, true],
            allowZoom: [Atomic.VAR_BOOL, true]
        };
        this.debug = Console_1.default.debug;
        this.game = Atomic.game;
        this.input = null;
        this.shootDelta = 0;
        this.delta = 0;
        this.allowMove = true;
        this.allowShoot = true;
        this.allowZoom = true;
        this.health = 10;
        this.armor = 10;
        this.body = null;
        this.contactCount = 0;
    }
    Player.prototype.start = function () {
        this.input = this.game.input;
        var spaceSheet = this.game.getSpriteSheet2D('Sprites/SpaceGame/Ships/spacegame_sheet.xml');
        var sprite2D = this.node.createComponent('StaticSprite2D');
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
        this.body = this.node.getComponent('RigidBody2D');
        this.subscribeToEvent('PhysicsBeginContact2D', function (event) {
            if (event.bodyB == this.body)
                this.contactCount++;
        });
        this.subscribeToEvent('PhysicsEndContact2D', function (event) {
            if (event.bodyB == this.body)
                this.contactCount--;
        });
    };
    Player.prototype.onHit = function () {
        Atomic.print('Player.onHit()');
        var node = this.scene.createChild('Explosion');
        var explosion = node.createJSComponent('Components/SpaceGame/Graphics/Explosion.js', {
            spawnPosition: node.worldPosition2D
        });
        this.health--;
    };
    Player.prototype.doShooting = function (timeStep) {
        if (this.shootDelta > 0) {
            this.shootDelta -= timeStep;
            if (this.shootDelta < 0) {
                this.shootDelta = 0;
            }
            return;
        }
        var i = this.input;
        if (!i.getKeyDown(Atomic.KEY_SPACE)) {
            return;
        }
        this.shootDelta = 0.15;
        var pos = this.node.position2D;
        pos[1] += 0.5;
        Atomic.print('SHOOT');
        this.spawnBullet(pos, true);
    };
    Player.prototype.moveShip = function (timeStep) {
        var config = this.game.config;
        var camera = this.game.camera;
        var cameraNode = camera.getNode();
        var speed = 2.0 * timeStep;
        var rotationSpeed = 0.4;
        var pos = this.node.position2D;
        var rot = this.node.rotation2D;
        var i = this.input;
        var left = i.getKeyDown(Atomic.KEY_LEFT) || i.getKeyDown(Atomic.KEY_A);
        var right = i.getKeyDown(Atomic.KEY_RIGHT) || i.getKeyDown(Atomic.KEY_D);
        var up = i.getKeyDown(Atomic.KEY_UP) || i.getKeyDown(Atomic.KEY_W);
        var down = i.getKeyDown(Atomic.KEY_DOWN) || i.getKeyDown(Atomic.KEY_S);
        var shoot = i.getKeyDown(Atomic.KEY_SPACE);
        if (left) {
            this.node.rotate2D(rotationSpeed);
        }
        if (right) {
            this.node.rotate2D(-rotationSpeed);
        }
        if (up) {
            var levelX = config.levelWidth * Atomic.PIXEL_SIZE;
            var levelY = config.levelHeight * Atomic.PIXEL_SIZE;
            var x = pos[0] + speed * Math.cos(rot * Math.PI / 180);
            var y = pos[1] + speed * Math.sin(rot * Math.PI / 180);
            if (x >= -levelX && x <= levelX) {
                pos[0] = x;
            }
            if (y >= -levelY && y <= levelY) {
                pos[1] = y;
            }
        }
        if (down) {
            var levelX = config.levelWidth * Atomic.PIXEL_SIZE;
            var levelY = config.levelHeight * Atomic.PIXEL_SIZE;
            var x = pos[0] - speed * Math.cos(rot * Math.PI / 180);
            var y = pos[1] - speed * Math.sin(rot * Math.PI / 180);
            if (x >= -levelX && x <= levelX) {
                pos[0] = x;
            }
            if (y >= -levelY && y <= levelY) {
                pos[1] = y;
            }
        }
        this.node.position2D = pos;
        cameraNode.position2D = pos;
    };
    Player.prototype.update = function (timeStep) {
        if (this.allowShoot) {
            this.doShooting(timeStep);
        }
        if (this.allowMove) {
            this.moveShip(timeStep);
        }
        if (this.allowZoom) {
            this.zoom(timeStep);
        }
    };
    Player.prototype.zoom = function (timeStep) {
        var camera = this.game.camera;
        var i = this.input;
        var zoomIn = i.getKeyDown(Atomic.KEY_I);
        var zoomOut = i.getKeyDown(Atomic.KEY_O);
        if (zoomIn) {
            camera.zoom += timeStep;
        }
        if (zoomOut) {
            camera.zoom -= timeStep;
        }
    };
    Player.prototype.spawnBullet = function (pos, isPlayer) {
        var bulletNode = this.game.scene.createChild('Bullet');
        var bullet = bulletNode.createJSComponent('Components/SpaceGame/Bullet.js');
        bullet.init(isPlayer, pos, this.node.rotation2D);
    };
    return Player;
}(Atomic.JSComponent));
module.exports = Player;
//# sourceMappingURL=Player.js.map