'atomic component';
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Console_1 = require("../../Modules/Atomic/Console");
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        _super.call(this);
        this.debug = Console_1.default.debug;
        this.game = Atomic.game;
        this.isPlayer = false;
        this.player = this.game.scene.getChild('Player');
    }
    Bullet.prototype.init = function (isPlayer, spawnPosition, rotation2D) {
        this.isPlayer = isPlayer;
        this.initPos = this.player.position2D;
        this.initRot = this.player.rotation2D;
        var sprite2D = this.node.createComponent('StaticSprite2D');
        if (this.isPlayer) {
            sprite2D.sprite = this.game.getSprite2D('Sprites/SpaceGame/Effects/blue_beam.png');
        }
        else {
            sprite2D.sprite = this.game.getSprite2D('Sprites/SpaceGame/Effects/green_beam.png');
        }
        sprite2D.blendMode = Atomic.BLEND_ADDALPHA;
        this.node.position2D = spawnPosition;
        this.node.rotation2D = rotation2D;
    };
    Bullet.prototype.update = function (timeStep) {
        var speed = this.isPlayer ? 2 : 1;
        speed *= timeStep;
        var x = this.initPos[0] + speed * Math.cos(this.node.rotation2D * Math.PI / 180);
        var y = this.initPos[1] + speed * Math.sin(this.node.rotation2D * Math.PI / 180);
        this.node.translate2D([x, y]);
        if (this.isPlayer) {
            if (this.updatePlayerBullet()) {
                Atomic.destroy(this.node);
            }
        }
        else {
        }
    };
    Bullet.prototype.updatePlayerBullet = function () {
        var camera = this.game.camera;
        var bpos = this.node.position2D;
        if (bpos[1] > 10) {
            return true;
        }
    };
    return Bullet;
}(Atomic.JSComponent));
module.exports = Bullet;
//# sourceMappingURL=Bullet.js.map