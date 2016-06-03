"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require('../../Atomic/State/State');
var MainMenuState = (function (_super) {
    __extends(MainMenuState, _super);
    function MainMenuState(key, game) {
        _super.call(this, key, game);
        this.ready = false;
        this.fireButton = null;
    }
    MainMenuState.prototype.preload = function () {
        this.debug('MainMenuState.preload()');
        _super.prototype.preload.call(this);
        this.debug('MainMenuState.preload(): load Scenes/SpaceGame/Scene01');
        this.game.createScene2D('Scenes/SpaceGame/Scene01.scene');
        this.ready = true;
    };
    MainMenuState.prototype.create = function () {
        this.debug('MainMenuState.create()');
        _super.prototype.create.call(this);
        if (Atomic.platform == 'Android' || Atomic.platform == 'iOS') {
            this.startMobile();
        }
        this.game.playMusic('Music/SpaceGame/battle.ogg');
    };
    MainMenuState.prototype.update = function (game, timeStep) {
        this.debug('MainMenuState.update(): timeStep=' + timeStep.toPrecision(10));
        _super.prototype.update.call(this, game, timeStep);
        if (this.ready === true) {
        }
    };
    MainMenuState.prototype.startMobile = function () {
        this.fireButton = new Atomic.UIButton();
        this.fireButton.skinBg = '';
        var fireButtonImage = new Atomic.UIImageWidget();
        fireButtonImage.setImage('UI/SpaceGame/fireButton.png');
        var fireButtonWidth = fireButtonImage.imageWidth * 2.2;
        var fireButtonHeight = fireButtonImage.imageHeight * 2.2;
        var posX = Atomic.graphics.width - Atomic.graphics.width / 8 - fireButtonWidth / 2;
        var posY = Atomic.graphics.height - Atomic.graphics.height / 4 - fireButtonHeight / 2;
        this.fireButton.rect = [posX, posY, posX + fireButtonWidth, posY + fireButtonHeight];
        fireButtonImage.rect = [0, 0, fireButtonWidth, fireButtonHeight];
        this.fireButton.addChild(fireButtonImage);
        this.fireButton.setCapturing(false);
        Atomic.input.bindButton(this.fireButton, Atomic.KEY_SPACE);
    };
    return MainMenuState;
}(State_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MainMenuState;
//# sourceMappingURL=MainMenuState.js.map