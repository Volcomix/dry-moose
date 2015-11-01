/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var XCursor = require('./XCursor');
var YCursor = require('./YCursor');
var Cursor = (function (_super) {
    __extends(Cursor, _super);
    function Cursor() {
        _super.apply(this, arguments);
    }
    Cursor.prototype.render = function () {
        return (React.createElement("g", null, React.createElement(XCursor, {"data": this.props.data, x: this.props.x, "height": this.props.height, "scale": this.props.xScale}), React.createElement(YCursor, {y: this.props.y, "width": this.props.width, "scale": this.props.yScale}), React.createElement("rect", {"className": 'pane', "width": this.props.width, "height": this.props.height})));
    };
    return Cursor;
})(React.Component);
var Cursor;
(function (Cursor) {
    Cursor.defaultProps = {
        data: undefined,
        x: 200,
        y: 200,
        width: undefined,
        height: undefined,
        xScale: undefined,
        yScale: undefined
    };
})(Cursor || (Cursor = {}));
module.exports = Cursor;
