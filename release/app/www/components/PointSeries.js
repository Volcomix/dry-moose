"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var PointSeries = (function (_super) {
    __extends(PointSeries, _super);
    function PointSeries() {
        var _this = this;
        _super.apply(this, arguments);
        this.getPoint = function (d) {
            return (React.createElement("text", {className: 'material-icons', key: +_this.props.xAccessor(d), x: _this.props.xScale(_this.props.xAccessor(d)), y: _this.props.yScale(_this.props.yAccessor(d))}, _this.props.icon));
        };
    }
    PointSeries.prototype.render = function () {
        return (React.createElement("g", {className: 'point ' + this.props.className, clipPath: 'url(#' + this.props.clipPath + ')'}, this.props.data.map(this.getPoint)));
    };
    return PointSeries;
}(React.Component));
module.exports = PointSeries;
