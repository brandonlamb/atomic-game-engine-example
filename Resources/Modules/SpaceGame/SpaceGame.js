"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Generic2DGame_1 = require("../Atomic/Generic2DGame");
var LocalStorage_1 = require("../Atomic/Persistence/LocalStorage");
var BootState_1 = require("./States/BootState");
var PreloadState_1 = require("./States/PreloadState");
var MainMenuState_1 = require("./States/MainMenuState");
var SpaceGame = (function (_super) {
    __extends(SpaceGame, _super);
    function SpaceGame(config) {
        _super.call(this, config);
        this.storage = new LocalStorage_1.default();
    }
    SpaceGame.prototype.createScene2D = function (filename) {
        var scene = _super.prototype.createScene2D.call(this, filename);
        if (this.config.useRenderPath) {
            this.viewport.renderPath.append(this.cache.getResource('XMLFile', 'Data/SpaceGame/RenderPath.xml'));
        }
        if (this.config.blackAndWhite) {
            this.viewport.renderPath.append(this.cache.getResource('XMLFile', 'PostProcess/GreyScale.xml'));
        }
        if (this.config.blur) {
            this.viewport.renderPath.append(this.cache.getResource('XMLFile', 'PostProcess/Blur.xml'));
        }
        this.viewport.setDrawDebug(true);
        return scene;
    };
    SpaceGame.prototype.playMusic = function (filename) {
        this.debug('SpaceGame.playMusic(): filename=' + filename);
        if (!this.config.music) {
            return;
        }
        _super.prototype.playMusic.call(this, filename);
    };
    SpaceGame.prototype.start = function () {
        this.debug('SpaceGame.start()');
        _super.prototype.start.call(this);
        this.halfWidth = this.graphics.width * Atomic.PIXEL_SIZE;
        this.halfHeight = this.graphics.height * Atomic.PIXEL_SIZE;
        this.graphics.setWindowSize(this.config.width, this.config.height);
        this.stateManager.add('Boot', new BootState_1.default());
        this.stateManager.add('Preload', new PreloadState_1.default());
        this.stateManager.add('MainMenu', new MainMenuState_1.default());
        this.stateManager.start('Boot');
    };
    return SpaceGame;
}(Generic2DGame_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SpaceGame;
//# sourceMappingURL=SpaceGame.js.map