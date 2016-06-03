"use strict";
var Console_1 = require("./../../Atomic/Console");
var PREFS_FILE = 'SpaceGameMultiPlayer.json';
var LocalStorage = (function () {
    function LocalStorage() {
        this.debug = Console_1.default.debug;
        this.filesystem = Atomic.getFileSystem();
        this.documentsDir = null;
        this.prefFilePath = null;
        this.documentsDir = this.filesystem.getUserDocumentsDir();
        this.prefFilePath = this.documentsDir + PREFS_FILE;
    }
    LocalStorage.prototype.getJSONPrefData = function () {
        if (!this.filesystem.fileExists(this.prefFilePath)) {
            return {};
        }
        var file = new Atomic.File(this.prefFilePath, Atomic.FILE_READ);
        return JSON.parse(file.readText());
    };
    LocalStorage.prototype.setServerName = function (serverName) {
        var data = this.getJSONPrefData();
        data.serverName = serverName;
        var file = new Atomic.File(this.prefFilePath, Atomic.FILE_WRITE);
        file.writeString(JSON.stringify(data));
        file.close();
    };
    LocalStorage.prototype.getServerName = function () {
        var data = this.getJSONPrefData();
        return (data.serverName) ? data.serverName : 'Server';
    };
    LocalStorage.prototype.setPlayerName = function (playerName) {
        var data = this.getJSONPrefData();
        data.playerName = playerName;
        var file = new Atomic.File(this.prefFilePath, Atomic.FILE_WRITE);
        file.writeString(JSON.stringify(data));
        file.close();
    };
    LocalStorage.prototype.getPlayerName = function () {
        var data = this.getJSONPrefData();
        return (data.playerName) ? data.playerName : 'Player';
    };
    return LocalStorage;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LocalStorage;
//# sourceMappingURL=LocalStorage.js.map