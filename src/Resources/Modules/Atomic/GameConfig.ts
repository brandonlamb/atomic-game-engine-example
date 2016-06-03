interface GameConfig {
  width?:number;
  height?:number;
  debug?:boolean;
  defaultScene?:string;
  blackAndWhite?:boolean;
  blur?:boolean;
  useRenderPath?:boolean;
  music:boolean;
}

export default GameConfig;
