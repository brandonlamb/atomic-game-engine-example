import "vendor";
// import Bootstrap from "../Modules/SpinnerGame/Bootstrap";
import Bootstrap from "../Modules/SpaceGame/Bootstrap";

const bootstrap = new Bootstrap(
  {
    width: 1280,
    height: 720,
    useRenderPath: false,
    blackAndWhite: false,
    blur: false,
    debug: false,
    music: false,
    levelWidth: 8096,
    levelHeight: 8096
  }
);
bootstrap.init();
bootstrap.start();

export function update(timeStep:number):void {
  bootstrap.update(timeStep);
}
