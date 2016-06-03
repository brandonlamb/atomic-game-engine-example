"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require("../../Atomic/State/State");
var MainMenuState = (function (_super) {
    __extends(MainMenuState, _super);
    function MainMenuState(key, game) {
        _super.call(this, key, game);
        this.ready = false;
    }
    MainMenuState.prototype.preload = function () {
        this.debug('MainMenuState.preload()');
        _super.prototype.preload.call(this);
        this.debug('MainMenuState.preload(): load Scenes/SpinnerGame/Scene01');
        this.game.createScene2D('Scenes/SpinnerGame/Scene01.scene');
        this.ready = true;
    };
    MainMenuState.prototype.create = function () {
        this.debug('MainMenuState.create()');
        _super.prototype.create.call(this);
        this.game.playMusic('Music/SpinnerGame/battle.ogg');
    };
    MainMenuState.prototype.update = function (game, timeStep) {
        this.debug('MainMenuState.update(): timeStep=' + timeStep.toPrecision(10));
        _super.prototype.update.call(this, game, timeStep);
        if (this.ready === true) {
        }
    };
    return MainMenuState;
}(State_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MainMenuState;
//# sourceMappingURL=MainMenuState.js.map