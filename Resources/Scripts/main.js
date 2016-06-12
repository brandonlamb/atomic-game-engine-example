"use strict";
require("vendor");
var Bootstrap_1 = require("../Modules/SpaceGame/Bootstrap");
var bootstrap = new Bootstrap_1.default({
    width: 600,
    height: 400,
    useRenderPath: false,
    blackAndWhite: false,
    blur: false,
    debug: false,
    music: false
});
bootstrap.init();
bootstrap.start();
function update(timeStep) {
    bootstrap.update(timeStep);
}
exports.update = update;
//# sourceMappingURL=main.js.map