/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var XCursor = (function (_super) {
    __extends(XCursor, _super);
    function XCursor() {
        _super.apply(this, arguments);
        this.dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
    }
    XCursor.prototype.render = function () {
        var dateTime = this.snapDateTime();
        return (React.createElement("g", {"className": 'x cursor', "transform": 'translate(' + this.props.scale(dateTime) + ', 0)'}, React.createElement("line", {"y2": this.props.height}), React.createElement("rect", {x: -60, y: this.props.height, "width": 120, "height": 14}), React.createElement("text", {"dy": '.71em', y: this.props.height + 3}, this.dateFormat(dateTime))));
    };
    XCursor.prototype.snapDateTime = function () {
        var bisect = d3.bisector(this.props.accessor).left, x0 = this.props.scale.invert(this.props.mouseX), i = bisect(this.props.data, x0, 1), d0 = this.props.data[i - 1], d1 = this.props.data[i], d;
        if (d1) {
            var domain = this.props.scale.domain();
            if (this.props.accessor(d1) > domain[1]) {
                d = d0;
            }
            else if (this.props.accessor(d0) < domain[0]) {
                d = d1;
            }
            else if (+x0 - +this.props.accessor(d0) > +this.props.accessor(d1) - +x0) {
                d = d1;
            }
            else {
                d = d0;
            }
        }
        else {
            d = d0;
        }
        if (Math.abs(+this.props.accessor(d) - +x0) > this.props.snapThreshold) {
            return x0;
        }
        return this.props.accessor(d);
    };
    return XCursor;
})(React.Component);
var XCursor;
(function (XCursor) {
    XCursor.defaultProps = {
        data: undefined,
        accessor: undefined,
        mouseX: undefined,
        height: undefined,
        scale: undefined,
        snapThreshold: 60000
    };
})(XCursor || (XCursor = {}));
module.exports = XCursor;
