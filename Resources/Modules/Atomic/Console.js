"use strict";
var Console = (function () {
    function Console() {
    }
    Console.debug = function (message) {
        if (Console.DEBUG) {
            Atomic.print(message);
        }
    };
    Console.DEBUG = false;
    return Console;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Console;
//# sourceMappingURL=Console.js.map