"atomic component";

class Debug extends Atomic.JSComponent {
  private text:Atomic.UIEditField;

  start():void {
    let view:Atomic.UIView = new Atomic.UIView();

    // Create a layout, otherwise child widgets won't know how to size themselves
    // and would manually need to be sized
    let layout:Atomic.UILayout = new Atomic.UILayout();

    // specify the layout region
    layout.rect = view.rect;
    view.addChild(layout);

    // we're laying out on the X axis so "position" controls top and bottom alignment
    layout.layoutPosition = Atomic.UI_LAYOUT_POSITION_LEFT_TOP;

    // while "distribution" handles the Y axis
    layout.layoutDistributionPosition = Atomic.UI_LAYOUT_DISTRIBUTION_POSITION_LEFT_TOP;

    var fd = new Atomic.UIFontDescription();
    fd.id = "Arial";
    fd.size = 36;

    this.text = new Atomic.UIEditField();
    this.text.fontDescription = fd;
    this.text.readOnly = true;
    this.text.multiline = true;
    this.text.adaptToContentSize = true;
    this.text.text = "POS: ";

    layout.addChild(this.text);
  }

  update(timeStep:number):void {
    this.text.text = 'TEST';
  }
}
