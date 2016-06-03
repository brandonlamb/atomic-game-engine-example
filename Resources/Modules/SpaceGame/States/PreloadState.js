"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require("../../Atomic/State/State");
var PreloadState = (function (_super) {
    __extends(PreloadState, _super);
    function PreloadState(key, game) {
        _super.call(this, key, game);
        this.ready = false;
    }
    PreloadState.prototype.preload = function () {
        this.debug('PreloadState.preload()');
        _super.prototype.preload.call(this);
        this.cache.releaseAllResources();
        var self = this;
        var resources = {
            'Music/SpaceGame/battle.ogg': 'Sound',
            'Sounds/SpaceGame/boom0.wav': 'Sound',
            'Sounds/SpaceGame/boom1.wav': 'Sound',
            'Sounds/SpaceGame/laser01.wav': 'Sound',
            'Sounds/SpaceGame/laser02.wav': 'Sound',
            'Sprites/SpaceGame/Backgrounds/space_background.png': 'Sprite2D',
            'Sprites/SpaceGame/Effects/explosions_sheet.xml': 'SpriteSheet2D'
        };
        Object.keys(resources).forEach(function (key) {
            try {
                self.cache.getResource(resources[key], key);
                self.debug('Pre-caching: ' + resources[key] + ' ' + key);
            }
            catch (e) {
                self.debug('PreloadState.preload(): error=' + e);
            }
        });
        this.ready = true;
    };
    PreloadState.prototype.update = function (game, timeStep) {
        this.debug('PreloadState.update(): timeStep=' + timeStep.toPrecision(10));
        _super.prototype.update.call(this, game, timeStep);
        if (this.ready === true) {
            this.stateManager.start('MainMenu');
        }
    };
    return PreloadState;
}(State_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PreloadState;
//# sourceMappingURL=PreloadState.js.map