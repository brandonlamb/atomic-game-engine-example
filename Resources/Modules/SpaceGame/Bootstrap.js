"use strict";
var Console_1 = require("../Atomic/Console");
var SpaceGame_1 = require("./SpaceGame");
var Bootstrap = (function () {
    function Bootstrap(config) {
        this.debug = Console_1.default.debug;
        this.game = null;
        Console_1.default.DEBUG = config.debug;
        this.game = new SpaceGame_1.default(config);
        Atomic.game = this.game;
    }
    Bootstrap.prototype.init = function () {
        this.game.init();
    };
    Bootstrap.prototype.start = function () {
        this.debug('main.start()');
        this.game.boot();
        this.game.start();
    };
    Bootstrap.prototype.update = function (timeStep) {
        this.debug('Bootstrap.update(): timeStep=' + timeStep.toPrecision(10));
        this.game.update(timeStep);
    };
    return Bootstrap;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Bootstrap;
//# sourceMappingURL=Bootstrap.js.map