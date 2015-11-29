/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var CursorActions = require('../actions/CursorActions');
var YCursor = (function (_super) {
    __extends(YCursor, _super);
    function YCursor(props) {
        var _this = this;
        _super.call(this, props);
        this.onMouseMove = function () {
            var mouse = d3.mouse(_this.pane);
            CursorActions.move(mouse);
            _this.setState({ mouseY: mouse[1] });
        };
        this.onMouseOut = function () {
            CursorActions.hide();
            _this.setState(YCursor.defaultState);
        };
        this.state = YCursor.defaultState;
    }
    Object.defineProperty(YCursor.prototype, "label", {
        get: function () {
            var yValue = this.props.scale.invert(this.state.mouseY);
            return this.props.labelFormat(yValue);
        },
        enumerable: true,
        configurable: true
    });
    YCursor.prototype.componentDidMount = function () {
        var pane = d3.select(this.pane)
            .on('mousemove', this.onMouseMove)
            .call(this.props.zoom);
    };
    YCursor.prototype.componentWillUnmount = function () {
        d3.select(this.pane).on('mousemove', null);
    };
    Object.defineProperty(YCursor.prototype, "cursor", {
        get: function () {
            if (this.state.mouseY) {
                return (React.createElement("g", {"className": 'y cursor', "transform": 'translate(0, ' + this.state.mouseY + ')'}, React.createElement("line", {"x2": this.props.width}), React.createElement("rect", {x: this.props.width, y: -7, "width": 50, "height": 14}), React.createElement("text", {"dy": '.32em', x: this.props.width + 3}, this.label)));
            }
        },
        enumerable: true,
        configurable: true
    });
    YCursor.prototype.render = function () {
        var _this = this;
        return (React.createElement("g", null, this.cursor, React.createElement("rect", {"className": 'pane', "ref": function (ref) { return _this.pane = ref; }, "width": this.props.width, "height": this.props.height, "onMouseOut": this.onMouseOut})));
    };
    return YCursor;
})(React.Component);
var YCursor;
(function (YCursor) {
    YCursor.defaultState = {
        mouseY: undefined
    };
})(YCursor || (YCursor = {}));
module.exports = YCursor;
