"use strict";
var State_1 = require("./State");
var Console_1 = require("./../../Atomic/Console");
var StateManager = (function () {
    function StateManager(game) {
        this.debug = Console_1.default.debug;
        this.game = null;
        this.pendingStateKey = null;
        this.currentStateKey = null;
        this.states = {};
        this.created = false;
        this.clearWorld = true;
        this.clearCache = true;
        this.args = [];
        this.callbackContext = null;
        this.onInitCallback = null;
        this.onShutdownCallback = null;
        this.onPreloadCallback = null;
        this.onLoadUpdateCallback = null;
        this.onCreateCallback = null;
        this.onUpdateCallback = null;
        this.onPausedCallback = null;
        this.onResumedCallback = null;
        this.onPauseUpdateCallback = null;
        this.game = game;
    }
    StateManager.prototype.boot = function () {
        this.debug('StateManager.boot()');
        if (this.pendingStateKey !== null && typeof this.pendingStateKey !== 'string') {
            this.add('default', this.pendingStateKey, true);
        }
        return this;
    };
    StateManager.prototype.add = function (key, state, autoStart) {
        if (autoStart === void 0) { autoStart = false; }
        this.debug('StateManager.add(): key=' + key);
        if (state instanceof State_1.default) {
            this.states[key] = state;
        }
        else if (typeof state === 'object') {
            this.states[key] = state;
            this.states[key].game = this.game;
        }
        else if (typeof state === 'function') {
            this.states[key] = Object.create(state, { key: key, game: this.game });
        }
        if (autoStart) {
            this.start(key);
        }
        return this.states[key];
    };
    StateManager.prototype.remove = function (key) {
        this.debug('StateManager.remove(): key=' + key);
        if (this.currentStateKey === key) {
            this.callbackContext = null;
            this.onInitCallback = null;
            this.onShutdownCallback = null;
            this.onPreloadCallback = null;
            this.onLoadUpdateCallback = null;
            this.onCreateCallback = null;
            this.onUpdateCallback = null;
            this.onPausedCallback = null;
            this.onResumedCallback = null;
            this.onPauseUpdateCallback = null;
        }
        delete this.states[key];
        return this;
    };
    StateManager.prototype.start = function (key, clearWorld, clearCache) {
        if (clearWorld === void 0) { clearWorld = true; }
        if (clearCache === void 0) { clearCache = true; }
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var ARG_COUNT = 3;
        this.debug('StateManager.start(): key=' + key);
        if (this.checkState(key)) {
            this.pendingStateKey = key;
            this.clearWorld = clearWorld;
            this.clearCache = clearCache;
            if (arguments.length > ARG_COUNT) {
                this.args = Array.prototype.splice.call(arguments, ARG_COUNT);
            }
        }
        return this;
    };
    StateManager.prototype.checkState = function (key) {
        this.debug('StateManager.checkState(): key=' + key);
        if (typeof this.states[key] === 'undefined' || this.states[key] === null) {
            this.debug('StateManager - No state found with the key: ' + key);
            return false;
        }
        if (this.states[key].preload || this.states[key].create || this.states[key].update
            || this.states[key].render) {
            return true;
        }
        this.debug('Invalid Atomic State object given. Must contain at least a one of the required functions: preload, create, update or render');
        return false;
    };
    StateManager.prototype.clearCurrentState = function () {
        this.debug('StateManager.clearCurrentState()');
        if (this.currentStateKey) {
            if (this.onShutdownCallback) {
                this.onShutdownCallback.call(this.callbackContext, this.game);
            }
            if (this.clearWorld && this.clearCache === true) {
                this.game.cache.releaseAllResources(true);
            }
        }
        return this;
    };
    StateManager.prototype.setCurrentState = function (key) {
        this.debug('StateManager.setCurrentState(): key=' + key);
        this.callbackContext = this.states[key];
        this.link(key);
        this.onCreateCallback = this.states[key].create || null;
        this.onInitCallback = this.states[key].init || this.dummy;
        this.onPausedCallback = this.states[key].paused || null;
        this.onPauseUpdateCallback = this.states[key].pauseUpdate || null;
        this.onPreloadCallback = this.states[key].preload || null;
        this.onResumedCallback = this.states[key].resumed || null;
        this.onUpdateCallback = this.states[key].update || null;
        this.onShutdownCallback = this.states[key].shutdown || this.dummy;
        this.currentStateKey = key;
        this.created = false;
        this.onInitCallback.apply(this.callbackContext, this.args);
        if (key === this.pendingStateKey) {
            this.args = [];
        }
        return this;
    };
    StateManager.prototype.getCurrentState = function () {
        return this.getState(this.currentStateKey);
    };
    StateManager.prototype.getState = function (key) {
        return this.states[key];
    };
    StateManager.prototype.link = function (key) {
        this.debug('StateManager.link(): key=' + key);
        if (!this.states[key]) {
            throw new Error('State ' + key + ' does not exist');
        }
        this.states[key].cache = this.game.cache;
        this.states[key].camera = this.game.camera;
        this.states[key].game = this.game;
        this.states[key].input = this.game.input;
        this.states[key].key = key;
        this.states[key].sound = this.game.sound;
        this.states[key].stateManager = this;
        return this;
    };
    StateManager.prototype.unlink = function (key) {
        this.debug('StateManager.unlink(): key=' + key);
        if (!this.states[key]) {
            throw new Error('State ' + key + ' does not exist');
        }
        this.states[key].cache = null;
        this.states[key].camera = null;
        this.states[key].game = null;
        this.states[key].input = null;
        this.states[key].sound = null;
        this.states[key].stateManager = null;
        return this;
    };
    StateManager.prototype.dummy = function () {
        return this;
    };
    StateManager.prototype.destroy = function () {
        this.debug('StateManager.destroy()');
        this.clearCurrentState();
        this.callbackContext = null;
        this.onInitCallback = null;
        this.onShutdownCallback = null;
        this.onPreloadCallback = null;
        this.onLoadUpdateCallback = null;
        this.onCreateCallback = null;
        this.onUpdateCallback = null;
        this.onPausedCallback = null;
        this.onResumedCallback = null;
        this.onPauseUpdateCallback = null;
        this.game = null;
        this.states = {};
        this.pendingStateKey = null;
        this.currentStateKey = '';
        return this;
    };
    StateManager.prototype.preUpdate = function (timeStep) {
        this.debug('StateManager.preUpdate(): pendingStateKey=' + this.pendingStateKey + ','
            + 'timeStep=' + timeStep.toPrecision(10));
        if (this.pendingStateKey && this.game.booted) {
            this.clearCurrentState();
            this.setCurrentState(this.pendingStateKey);
            if (this.currentStateKey !== this.pendingStateKey) {
                return this;
            }
            else {
                this.pendingStateKey = null;
            }
            if (this.onPreloadCallback) {
                this.onPreloadCallback.call(this.callbackContext, this.game, timeStep);
                this.loadComplete();
            }
            else {
                this.loadComplete();
            }
        }
        return this;
    };
    StateManager.prototype.loadComplete = function () {
        this.debug('StateManager.loadComplete()');
        if (this.created === false && this.onCreateCallback) {
            this.onCreateCallback.call(this.callbackContext);
        }
        this.created = true;
        return this;
    };
    StateManager.prototype.pause = function () {
        if (this.created && this.onPausedCallback) {
            this.onPausedCallback.call(this.callbackContext);
        }
        return this;
    };
    StateManager.prototype.resume = function () {
        if (this.created && this.onResumedCallback) {
            this.onResumedCallback.call(this.callbackContext);
        }
        return this;
    };
    StateManager.prototype.update = function (timeStep) {
        this.debug('StateManager.update(): timeStep=' + timeStep.toPrecision(10) + ', currentStateKey='
            + this.currentStateKey);
        if (this.created) {
            if (this.onUpdateCallback) {
                this.onUpdateCallback.call(this.callbackContext, this.game, timeStep);
            }
        }
        else {
            if (this.onLoadUpdateCallback) {
                this.onLoadUpdateCallback.call(this.callbackContext, this.game, timeStep);
            }
        }
        return this;
    };
    StateManager.prototype.pauseUpdate = function () {
        if (this.created) {
            if (this.onPauseUpdateCallback) {
                this.onPauseUpdateCallback.call(this.callbackContext);
            }
        }
        else {
            if (this.onLoadUpdateCallback) {
                this.onLoadUpdateCallback.call(this.callbackContext);
            }
        }
        return this;
    };
    return StateManager;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StateManager;
//# sourceMappingURL=StateManager.js.map