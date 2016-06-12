'atomic component';

import SpaceGame from "../../../../Modules/SpaceGame/SpaceGame";
import Console from "../../../../Modules/Atomic/Console";

class Debug extends Atomic.JSComponent {
  private text:Atomic.UIEditField;
  private debug:Function = Console.debug;
  private game:SpaceGame = Atomic.game;
  private camLimit:number;

  start():void {
    let view:Atomic.UIView = new Atomic.UIView();
    this.camLimit = this.game.config.levelWidth * Atomic.PIXEL_SIZE;

    // Create a layout, otherwise child widgets won't know how to size themselves
    // and would manually need to be sized
    let layout:Atomic.UILayout = new Atomic.UILayout();

    // specify the layout region
    layout.rect = view.rect;
    view.addChild(layout);

    // we're laying out on the X axis so 'position' controls top and bottom alignment
    layout.layoutPosition = Atomic.UI_LAYOUT_POSITION_LEFT_TOP;
    // layout.layoutPosition = Atomic.UI_LAYOUT_POSITION_CENTER;

    // while 'distribution' handles the Y axis
    layout.layoutDistributionPosition = Atomic.UI_LAYOUT_DISTRIBUTION_POSITION_LEFT_TOP;
    // layout.layoutDistributionPosition = Atomic.UI_LAYOUT_DISTRIBUTION_POSITION_CENTER;

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
  }

  update(timeStep:number):void {
    let player:Atomic.Node = this.game.scene.getChild('Player');
    let camera:Atomic.Camera = <Atomic.Camera>player.getChild('Camera').getComponent('Camera');
    let cameraPos:Atomic.Vector2 = camera.node.getPosition2D();

    let playerPos:Atomic.Vector2 = player.getPosition2D();
    let rot:number = player.getRotation2D();

    this.text.text = `CAMERA: ${cameraPos}\n`
      + `CAMERA ZOOM: ${camera.getZoom()}\n`
      + `PLAYER: ${playerPos}\n`
      + `CAMERA LIMIT: ${this.camLimit}\n`
      + `ROTATION: ${rot}`;
  }
}

export = Debug;
