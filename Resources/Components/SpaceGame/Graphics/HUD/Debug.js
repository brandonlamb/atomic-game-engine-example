"atomic component";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Debug = (function (_super) {
    __extends(Debug, _super);
    function Debug() {
        _super.apply(this, arguments);
    }
    Debug.prototype.start = function () {
        var view = new Atomic.UIView();
        var layout = new Atomic.UILayout();
        layout.rect = view.rect;
        view.addChild(layout);
        layout.layoutPosition = Atomic.UI_LAYOUT_POSITION_LEFT_TOP;
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
    };
    Debug.prototype.update = function (timeStep) {
        this.text.text = 'TEST';
    };
    return Debug;
}(Atomic.JSComponent));
//# sourceMappingURL=Debug.js.map