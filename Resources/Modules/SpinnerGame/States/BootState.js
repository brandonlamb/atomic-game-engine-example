"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require("../../Atomic/State/State");
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState(key, game) {
        if (key === void 0) { key = ''; }
        if (game === void 0) { game = null; }
        _super.call(this, key, game);
        this.ready = false;
    }
    BootState.prototype.preload = function () {
        this.debug('BootState.preload()');
        _super.prototype.preload.call(this);
        this.ready = true;
    };
    BootState.prototype.create = function () {
        this.debug('BootState.create()');
        _super.prototype.create.call(this);
    };
    BootState.prototype.update = function (game, timeStep) {
        this.debug('BootState.update(): timeStep=' + timeStep.toPrecision(10));
        _super.prototype.update.call(this, game, timeStep);
        if (this.ready === true) {
            this.stateManager.start('Preload');
        }
    };
    return BootState;
}(State_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BootState;
//# sourceMappingURL=BootState.js.map