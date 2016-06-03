import State from '../../Atomic/State/State';
import Game from '../../Atomic/Game';

/**
 * Main menu state
 *
 * @TODO: import dpad as typescript
 * @class MainMenuState
 * @augments State
 */
class MainMenuState extends State {
  private ready:boolean = false;
  private fireButton:Atomic.UIButton = null;

  /**
   * @constructor
   * @param {string} key
   * @param {Game} game
   */
  constructor(key?:string, game?:Game) {
    super(key, game);
  }

  /**
   * @function MainMenuState#preload
   * @inheritDoc
   * @override
   */
  preload():void {
    this.debug('MainMenuState.preload()');

    super.preload();

    this.debug('MainMenuState.preload(): load Scenes/SpaceGame/Scene01');
    this.game.createScene2D('Scenes/SpaceGame/Scene01.scene');
    // game.cameraNode.position = [0, -.5, -8];

    this.ready = true;
  }

  /**
   * @function MainMenuState#create
   * @inheritDoc
   * @override
   */
  create():void {
    this.debug('MainMenuState.create()');

    super.create();

    if (Atomic.platform == 'Android' || Atomic.platform == 'iOS') {
      this.startMobile();
    }

    // let spaceNode:Atomic.Node = this.game.scene.createChild('Background');
    // spaceNode.createJSComponent('Components/SpaceGame/Graphics/Background');

    this.game.playMusic('Music/SpaceGame/battle.ogg');
  }

  /**
   * @function MainMenuState#update
   * @inheritDoc
   * @override
   */
  update(game:Game, timeStep:number):void {
    this.debug('MainMenuState.update(): timeStep=' + timeStep.toPrecision(10));
    super.update(game, timeStep);

    if (this.ready === true) {
    }
  }

  startMobile():void {
    // require ours dpad module
    // let DPad = require('DPad');

    // create dpad
    // var dpad = new DPad();

    // add only horizontal buttons
    // dpad.addHorizontal();

    // init with existing ui
    // dpad.init(Atomic.game.uiView);

    // set X spacing
    // dpad.setSpacingX(50);

    // this.dpad = dpad;

    // create a jump button
    this.fireButton = new Atomic.UIButton();

    // unset its skin, because we will use UIImageWidget
    this.fireButton.skinBg = '';

    // create ours fire button image
    let fireButtonImage:Atomic.UIImageWidget = new Atomic.UIImageWidget();

    // load image
    fireButtonImage.setImage('UI/SpaceGame/fireButton.png');

    // resize ours image by 2.2x
    let fireButtonWidth:number = fireButtonImage.imageWidth * 2.2;
    let fireButtonHeight:number = fireButtonImage.imageHeight * 2.2;

    // calculate position
    let posX:number = Atomic.graphics.width - Atomic.graphics.width / 8 - fireButtonWidth / 2;
    let posY:number = Atomic.graphics.height - Atomic.graphics.height / 4 - fireButtonHeight / 2;

    // sets fireButton rect, specify position and end position
    this.fireButton.rect = [posX, posY, posX + fireButtonWidth, posY + fireButtonHeight];

    // sets fireButtonImage rect, we specify there only end position
    fireButtonImage.rect = [0, 0, fireButtonWidth, fireButtonHeight];

    // adds image to fireButton
    this.fireButton.addChild(fireButtonImage);

    // adds fireButton to the dpad view
    // dpad.view.addChild(this.fireButton);

    //sets fireButton capturing to false, because we wanna make it multitouchable
    this.fireButton.setCapturing(false);

    // binds fireButton to KEY_SPACE
    Atomic.input.bindButton(this.fireButton, Atomic.KEY_SPACE);
  }
}

export default MainMenuState;
