/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var YCursor = (function (_super) {
    __extends(YCursor, _super);
    function YCursor() {
        _super.apply(this, arguments);
    }
    YCursor.prototype.render = function () {
        return (React.createElement("g", {"className": 'y cursor', "transform": 'translate(0, ' + this.props.mouseY + ')'}, React.createElement("line", {"x2": this.props.width}), React.createElement("rect", {x: this.props.width, y: -7, "width": 50, "height": 14}), React.createElement("text", {"dy": '.32em', x: this.props.width + 3}, this.props.scale.invert(this.props.mouseY).toFixed(5))));
    };
    return YCursor;
})(React.Component);
module.exports = YCursor;
