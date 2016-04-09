"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var AreaSeries = (function (_super) {
    __extends(AreaSeries, _super);
    function AreaSeries() {
        _super.apply(this, arguments);
        this.area = d3.svg.area();
    }
    AreaSeries.prototype.render = function () {
        var _this = this;
        this.area
            .x(function (d) { return _this.props.xScale(_this.props.xAccessor(d)); })
            .y0(function (d) { return _this.props.yScale(_this.props.y0Accessor(d)); })
            .y1(function (d) { return _this.props.yScale(_this.props.y1Accessor(d)); });
        return (React.createElement("path", {className: 'area ' + this.props.className, d: this.area(this.props.data), clipPath: 'url(#' + this.props.clipPath + ')'}));
    };
    return AreaSeries;
}(React.Component));
module.exports = AreaSeries;
