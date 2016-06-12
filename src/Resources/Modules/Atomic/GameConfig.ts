interface GameConfig {
  width?:number;
  height?:number;
  debug?:boolean;
  defaultScene?:string;
  blackAndWhite?:boolean;
  blur?:boolean;
  useRenderPath?:boolean;
  music:boolean;
  levelWidth:number;
  levelHeight:number;
}

export default GameConfig;
