'atomic component';
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Console_1 = require("../../../Modules/Atomic/Console");
var Background = (function (_super) {
    __extends(Background, _super);
    function Background() {
        _super.apply(this, arguments);
        this.debug = Console_1.default.debug;
        this.game = Atomic.game;
        this.background = 'Sprites/SpaceGame/space_background.png';
        this.inspectorFields = {
            background: [Atomic.VAR_STRING, '']
        };
    }
    Background.prototype.start = function () {
        this.debug('Background.start(): background=' + this.background);
        if (this.background.length > 1) {
            this.createBackground();
        }
    };
    Background.prototype.createBackground = function () {
        this.debug('Background.createBackground(): background=' + this.background);
        var sprite = this.game.cache.getResource('Sprite2D', this.background);
        var sprite2D = this.node.createComponent('StaticSprite2D');
        sprite2D.orderInLayer = -100;
        sprite2D.blendMode = Atomic.BLEND_ADDALPHA;
        sprite2D.sprite = sprite;
    };
    Background.prototype.update = function (timeStep) {
        this.debug('Background.update(): position[1]=' + this.node.position[1]);
        if (this.node.position[1] < -19) {
            this.debug('Background.update(): HIT');
            this.node.position2D = [0, 18];
        }
        this.node.translate([0, -timeStep * .25, 0]);
    };
    return Background;
}(Atomic.JSComponent));
module.exports = Background;
//# sourceMappingURL=Background.js.map