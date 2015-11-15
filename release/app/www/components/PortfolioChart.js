/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var Chart = require('./Chart');
var PortfolioChart = (function (_super) {
    __extends(PortfolioChart, _super);
    function PortfolioChart() {
        _super.apply(this, arguments);
    }
    PortfolioChart.prototype.render = function () {
        return (React.createElement(Chart, {"data": this.props.portfolio, "xAccessor": function (d) { return d.dateTime; }, "yAccessor": function (d) { return d.value; }, "width": this.props.width, "height": this.props.height, "margin": this.props.margin, "xScale": this.props.xScale, "yTickFormat": PortfolioChart.yTickFormat, "zoom": this.props.zoom}));
    };
    PortfolioChart.yTickFormat = d3.format(',.2f');
    return PortfolioChart;
})(React.Component);
module.exports = PortfolioChart;
