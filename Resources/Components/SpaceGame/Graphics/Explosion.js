'atomic component';
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Console_1 = require("../../../Modules/Atomic/Console");
var Explosion = (function (_super) {
    __extends(Explosion, _super);
    function Explosion() {
        _super.apply(this, arguments);
        this.inspectionFields = {
            frame: [Atomic.VAR_INT, 0],
            frameTime: [Atomic.VAR_INT, 0]
        };
        this.debug = Console_1.default.debug;
        this.game = Atomic.game;
    }
    Explosion.prototype.start = function () {
        this.spritesheet = this.game.getSpriteSheet2D('Sprites/SpaceGame/Effects/explosions_sheet.xml');
        this.boomSound = this.game.getSound('Sounds/SpaceGame/boom' + Math.round(Math.random()) + '.wav');
        this.frame = 0;
        this.frameTime = 0;
        this.sprites = [];
        var i = Math.round(Math.random() * 7);
        for (var j = 0; j < 16; j++) {
            this.sprites.push(this.spritesheet.getSprite(i + '_' + j));
        }
        this.sprite2D = this.node.createComponent('StaticSprite2D');
        this.sprite2D.blendMode = Atomic.BLEND_ADDALPHA;
        this.sprite2D.sprite = this.sprites[0];
        this.node.position2D = this.spawnPosition;
        this.node.scale2D = [1.5, 1.5];
        this.sprite2D.orderInLayer = 200;
        this.soundSource = this.node.createComponent('SoundSource');
        this.soundSource.soundType = Atomic.SOUND_EFFECT;
        this.soundSource.play(this.boomSound);
    };
    Explosion.prototype.update = function (timeStep) {
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
    };
    return Explosion;
}(Atomic.JSComponent));
module.exports = Explosion;
//# sourceMappingURL=Explosion.js.map