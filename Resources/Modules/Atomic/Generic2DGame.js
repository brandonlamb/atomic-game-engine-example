"use strict";
var Console_1 = require("../Atomic/Console");
var StateManager_1 = require("./State/StateManager");
var CAMERA_POSITION_Z = -10.0;
var Generic2DGame = (function () {
    function Generic2DGame(config) {
        this.debug = Console_1.default.debug;
        this.engine = Atomic.getEngine();
        this.cache = Atomic.getResourceCache();
        this.renderer = Atomic.getRenderer();
        this.graphics = Atomic.getGraphics();
        this.input = Atomic.getInput();
        this.uiView = new Atomic.UIView();
        this.scene = null;
        this.cameraNode = null;
        this.camera = null;
        this.sound = null;
        this.viewport = null;
        this.config = null;
        this.stateManager = new StateManager_1.default(this);
        this.ready = false;
        this.booted = false;
        this.running = false;
        this.config = config;
        this.input.setMouseVisible(true);
        if (Atomic.platform == 'Android') {
            this.renderer.reuseShadowMaps = false;
            this.renderer.shadowQuality = Atomic.SHADOWQUALITY_LOW_16BIT;
        }
    }
    Generic2DGame.prototype.createScene2D = function (filename) {
        this.debug('Generic2DGame.createScene2D(): filename=' + filename);
        var scene, camera, cameraNode, viewport;
        if (this.scene) {
            this.scene.remove();
        }
        scene = new Atomic.Scene();
        if (typeof (filename) == 'string') {
            this.debug('Generic2DGame.createScene2D(): load=' + filename);
            scene.loadXML(filename);
            cameraNode = scene.getChild('Camera');
            camera = cameraNode.getComponent('Camera');
        }
        else {
            this.debug('Generic2DGame.createScene2D(): create scene');
            scene.createComponent('Octree');
            cameraNode = scene.createChild('Camera');
            cameraNode.position = [0.0, 0.0, CAMERA_POSITION_Z];
            camera = cameraNode.createComponent('Camera');
            camera.orthographic = true;
            camera.orthoSize = this.graphics.height * Atomic.PIXEL_SIZE;
        }
        if (Atomic.editor) {
            viewport = Atomic.editor.setView(scene, camera);
        }
        else {
            this.debug('Generic2DGame.createScene2D(): create viewport');
            viewport = new Atomic.Viewport(scene, camera);
            this.renderer.setViewport(0, viewport);
        }
        this.scene = scene;
        this.cameraNode = cameraNode;
        this.camera = camera;
        this.viewport = viewport;
        return scene;
    };
    Generic2DGame.prototype.getSprite2D = function (filename) {
        this.debug('Generic2DGame.getSprite2D(): filename=' + filename);
        return this.cache.getResource('Sprite2D', filename);
    };
    Generic2DGame.prototype.getSpriteSheet2D = function (filename) {
        this.debug('Generic2DGame.getSpriteSheet2D(): filename=' + filename);
        return this.cache.getResource('SpriteSheet2D', filename);
    };
    Generic2DGame.prototype.getSound = function (filename) {
        this.debug('Generic2DGame.getSound(): filename=' + filename);
        return this.cache.getResource('Sound', filename);
    };
    Generic2DGame.prototype.update = function (timeStep) {
        this.debug('Generic2DGame.update(): timeStep=' + timeStep.toPrecision(10));
        this.stateManager.preUpdate(timeStep);
        this.stateManager.update(timeStep);
        this.scene.update(timeStep);
    };
    Generic2DGame.prototype.init = function () {
        this.debug('Generic2DGame.init()');
    };
    Generic2DGame.prototype.start = function () {
        this.debug('Generic2DGame.start()');
        this.graphics.centerWindow();
        this.booted = true;
    };
    Generic2DGame.prototype.boot = function () {
        this.debug('Generic2DGame.boot()');
        if (this.booted) {
            this.debug('Generic2DGame.boot(): already booted');
            return;
        }
        this.stateManager.boot();
    };
    Generic2DGame.prototype.playMusic = function (filename) {
        this.debug('Generic2DGame.playMusic(): ' + filename);
        var musicFile = this.getSound(filename);
        musicFile.looped = true;
        var musicNode = this.scene.createChild('MusicNode');
        var musicSource = musicNode.createComponent('SoundSource');
        musicSource.soundType = Atomic.SOUND_MUSIC;
        musicSource.play(musicFile);
    };
    Generic2DGame.prototype.random = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    Generic2DGame.prototype.cleanup = function () {
        if (Atomic.platform == 'Android' || Atomic.platform == 'iOS') {
        }
        this.renderer.setViewport(1, null);
        Atomic.destroy(this.scene);
    };
    return Generic2DGame;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Generic2DGame;
//# sourceMappingURL=Generic2DGame.js.map