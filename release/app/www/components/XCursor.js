/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var Quote = require('../../../documents/Quote');
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
        var x0 = this.props.scale.invert(this.props.x), i = Quote.bisect(this.props.data, x0, 1), d0 = this.props.data[i - 1], d1 = this.props.data[i], quote;
        if (d1) {
            var domain = this.props.scale.domain();
            if (d1.dateTime > domain[1]) {
                quote = d0;
            }
            else if (d0.dateTime < domain[0]) {
                quote = d1;
            }
            else {
                quote = +x0 - +d0.dateTime > +d1.dateTime - +x0 ? d1 : d0;
            }
        }
        else {
            quote = d0;
        }
        if (Math.abs(+quote.dateTime - +x0) > this.props.snapThreshold) {
            return x0;
        }
        return quote.dateTime;
    };
    return XCursor;
})(React.Component);
var XCursor;
(function (XCursor) {
    XCursor.defaultProps = {
        data: undefined,
        x: undefined,
        height: undefined,
        scale: undefined,
        snapThreshold: 60000
    };
})(XCursor || (XCursor = {}));
module.exports = XCursor;
