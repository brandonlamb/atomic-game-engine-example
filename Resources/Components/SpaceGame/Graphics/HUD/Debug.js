'atomic component';
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Console_1 = require("../../../../Modules/Atomic/Console");
var Debug = (function (_super) {
    __extends(Debug, _super);
    function Debug() {
        _super.apply(this, arguments);
        this.debug = Console_1.default.debug;
        this.game = Atomic.game;
    }
    Debug.prototype.start = function () {
        var view = new Atomic.UIView();
        this.camLimit = this.game.config.levelWidth * Atomic.PIXEL_SIZE;
        var layout = new Atomic.UILayout();
        layout.rect = view.rect;
        view.addChild(layout);
        layout.layoutPosition = Atomic.UI_LAYOUT_POSITION_LEFT_TOP;
        layout.layoutDistributionPosition = Atomic.UI_LAYOUT_DISTRIBUTION_POSITION_LEFT_TOP;
        var fd = new Atomic.UIFontDescription();
        fd.id = 'Vera';
        fd.size = 8;
        this.text = new Atomic.UIEditField();
        this.text.fontDescription = fd;
        this.text.readOnly = true;
        this.text.multiline = true;
        this.text.adaptToContentSize = true;
        this.text.text = 'DEBUG';
        layout.addChild(this.text);
    };
    Debug.prototype.update = function (timeStep) {
        var cameraPos = Atomic.game.camera.node.getPosition2D();
        var player = Atomic.game.scene.getChild('Player');
        var playerPos = player.getPosition2D();
        var rot = player.getRotation2D();
        this.text.text = ("CAMERA: " + cameraPos + "\n")
            + ("PLAYER: " + playerPos + "\n")
            + ("CAMERA LIMIT: " + this.camLimit + "\n")
            + ("ROTATION: " + rot);
    };
    return Debug;
}(Atomic.JSComponent));
module.exports = Debug;
//# sourceMappingURL=Debug.js.map