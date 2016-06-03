import GameConfig from "./GameConfig";
import StateManager from "./State/StateManager";

interface Game {
  debug:Function;
  engine:Atomic.Engine;
  cache:Atomic.ResourceCache;
  renderer:Atomic.Renderer;
  graphics:Atomic.Graphics;
  input:Atomic.Input;
  uiView:Atomic.UIView;
  scene:Atomic.Scene;
  cameraNode:Atomic.Node;
  camera:Atomic.Component;
  sound:Atomic.Sound;
  viewport:Atomic.Viewport;

  config:GameConfig;
  stateManager:StateManager;

  ready:boolean;
  booted:boolean;
  running:boolean;

  createScene2D(filename:string):Atomic.Scene;
  getSprite2D(filename:string):Atomic.Sprite2D;
  getSpriteSheet2D(filename:string):Atomic.SpriteSheet2D;
  getSound(filename:string):Atomic.Sound;
  playMusic(filename:string):void;
  update(timeStep:number):void;
  init():void;
  start():void;
  boot():void;
  cleanup():void;
  random(min:number, max:number):number;
}

export default Game;
