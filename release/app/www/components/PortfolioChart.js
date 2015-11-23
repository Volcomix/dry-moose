/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var BaseChart = require('./BaseChart');
var PortfolioChart = (function (_super) {
    __extends(PortfolioChart, _super);
    function PortfolioChart() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.xAccessor = function (d) { return d.dateTime; };
        this.yAccessor = function (d) { return d.value; };
    }
    PortfolioChart.prototype.render = function () {
        return (React.createElement(BaseChart, {"title": 'Portfolio', "data": this.props.portfolio, "xAccessor": function (d) { return d.dateTime; }, "yAccessor": function (d) { return d.value; }, "width": this.props.width, "height": this.props.height, "margin": this.props.margin, "xScale": this.props.xScale, "yScale": this.yScale, "yTickFormat": PortfolioChart.yTickFormat, "clipPath": PortfolioChart.clipPath, "zoom": this.props.zoom, "yDomainPadding": 0.2}));
    };
    PortfolioChart.yTickFormat = d3.format(',.2f');
    PortfolioChart.clipPath = 'clipPortfolio';
    return PortfolioChart;
})(React.Component);
module.exports = PortfolioChart;
