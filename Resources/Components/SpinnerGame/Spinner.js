'atomic component';
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ROTATION_YAW = 'yaw';
var ROTATION_ROLL = 'roll';
var Spinner = (function (_super) {
    __extends(Spinner, _super);
    function Spinner() {
        _super.call(this);
        this.inspectorFields = {
            speed: [Atomic.VAR_INT, 100],
            rotateType: [Atomic.VAR_STRING, 'roll']
        };
    }
    Spinner.prototype.update = function (timeStep) {
        switch (this.rotateType) {
            case ROTATION_ROLL:
                this.node.roll(timeStep * 75 * this.speed);
                break;
            case ROTATION_YAW:
                this.node.yaw(timeStep * 75 * this.speed);
                break;
            default:
                throw new Error('Rotation type ' + this.rotateType + ' is not valid');
        }
    };
    return Spinner;
}(Atomic.JSComponent));
module.exports = Spinner;
//# sourceMappingURL=Spinner.js.map