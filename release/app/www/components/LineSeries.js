/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var LineSeries = (function (_super) {
    __extends(LineSeries, _super);
    function LineSeries(props) {
        var _this = this;
        _super.call(this, props);
        this.line = d3.svg.line();
        this.line
            .x(function (d) { return _this.props.xScale(d.dateTime); })
            .y(function (d) { return _this.props.yScale(d.close); });
    }
    LineSeries.prototype.render = function () {
        return React.createElement('path', {
            className: 'line',
            d: this.line(this.props.data),
            clipPath: this.props.clipPath
        }); // TSX doesn't know clipPath attribute
    };
    return LineSeries;
})(React.Component);
module.exports = LineSeries;
