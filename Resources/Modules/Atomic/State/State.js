"use strict";
var Console_1 = require("./../Console");
var State = (function () {
    function State(key, game) {
        this.debug = Console_1.default.debug;
        this.cache = null;
        this.camera = null;
        this.game = null;
        this.input = null;
        this.key = null;
        this.stateManager = null;
        this.sound = null;
        this.key = key;
        this.game = game;
    }
    State.prototype.create = function () {
    };
    State.prototype.init = function () {
    };
    State.prototype.paused = function () {
    };
    State.prototype.pauseUpdate = function () {
    };
    State.prototype.preload = function () {
    };
    State.prototype.resumed = function () {
    };
    State.prototype.update = function (game, timeStep) {
    };
    State.prototype.shutdown = function () {
    };
    return State;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = State;
//# sourceMappingURL=State.js.map