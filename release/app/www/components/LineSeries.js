"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var LineSeries = (function (_super) {
    __extends(LineSeries, _super);
    function LineSeries() {
        _super.apply(this, arguments);
        this.line = d3.svg.line();
    }
    LineSeries.prototype.render = function () {
        var _this = this;
        this.line
            .x(function (d) { return _this.props.xScale(_this.props.xAccessor(d)); })
            .y(function (d) { return _this.props.yScale(_this.props.yAccessor(d)); });
        return (React.createElement("path", {className: 'line ' + this.props.className, d: this.line(this.props.data), clipPath: 'url(#' + this.props.clipPath + ')'}));
    };
    return LineSeries;
}(React.Component));
module.exports = LineSeries;
