"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Generic2DGame_1 = require("../Atomic/Generic2DGame");
var BootState_1 = require("./States/BootState");
var PreloadState_1 = require("./States/PreloadState");
var MainMenuState_1 = require("./States/MainMenuState");
var SpinnerGame = (function (_super) {
    __extends(SpinnerGame, _super);
    function SpinnerGame(config) {
        _super.call(this, config);
    }
    SpinnerGame.prototype.playMusic = function (filename) {
        var musicFile = this.getSound(filename);
        musicFile.looped = true;
        var musicNode = this.scene.createChild('MusicNode');
        var musicSource = musicNode.createComponent('SoundSource');
        musicSource.gain = 0.5;
        musicSource.setSoundType('Music');
        musicSource.play(musicFile);
    };
    SpinnerGame.prototype.start = function () {
        this.debug('SpinnerGame.start()');
        _super.prototype.start.call(this);
        this.stateManager.add('Boot', new BootState_1.default());
        this.stateManager.add('Preload', new PreloadState_1.default());
        this.stateManager.add('MainMenu', new MainMenuState_1.default());
        this.stateManager.start('Boot');
    };
    return SpinnerGame;
}(Generic2DGame_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SpinnerGame;
//# sourceMappingURL=SpinnerGame.js.map