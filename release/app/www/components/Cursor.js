/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var XCursor = require('./XCursor');
var YCursor = require('./YCursor');
var Cursor = (function (_super) {
    __extends(Cursor, _super);
    function Cursor(props) {
        var _this = this;
        _super.call(this, props);
        this.zoom = d3.behavior.zoom();
        this.clearPosition = function () { return _this.setState({ position: undefined }); };
        this.updatePosition = function () { return _this.setState({ position: d3.mouse(_this.pane) }); };
        this.zoom.scaleExtent(this.props.zoomScaleExtent).x(this.props.xScale);
        this.state = { position: undefined };
    }
    Cursor.prototype.componentDidMount = function () {
        // Use d3.event to make d3.mouse work
        d3.select(this.pane).on('mousemove', this.updatePosition);
        this.zoom.on('zoom', this.props.onZoom);
        d3.select(this.pane).call(this.zoom);
    };
    Cursor.prototype.componentWillUnmount = function () {
        d3.select(this.pane).on('mousemove', null);
        this.zoom.on('zoom', null);
    };
    Cursor.prototype.render = function () {
        var _this = this;
        var xCursor, yCursor;
        if (this.state.position) {
            xCursor = (React.createElement(XCursor, {"data": this.props.data, x: this.state.position[0], "height": this.props.height, "scale": this.props.xScale}));
            yCursor = (React.createElement(YCursor, {y: this.state.position[1], "width": this.props.width, "scale": this.props.yScale}));
        }
        return (React.createElement("g", null, xCursor, yCursor, React.createElement("rect", {"className": 'pane', "ref": function (pane) { return _this.pane = pane; }, "width": this.props.width, "height": this.props.height, "onMouseOut": this.clearPosition})));
    };
    return Cursor;
})(React.Component);
var Cursor;
(function (Cursor) {
    Cursor.defaultProps = {
        data: undefined,
        width: undefined,
        height: undefined,
        xScale: undefined,
        yScale: undefined,
        zoomScaleExtent: [0.5, 10],
        onZoom: undefined
    };
})(Cursor || (Cursor = {}));
module.exports = Cursor;
