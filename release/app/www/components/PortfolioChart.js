/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var PortfolioChart = (function (_super) {
    __extends(PortfolioChart, _super);
    function PortfolioChart() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.xAccessor = function (d) { return d.dateTime; };
        this.yAccessor = function (d) { return d.value; };
    }
    PortfolioChart.prototype.render = function () {
        return (React.createElement("g", null));
    };
    PortfolioChart.yTickFormat = d3.format(',.2f');
    PortfolioChart.clipPath = 'clipPortfolio';
    return PortfolioChart;
})(React.Component);
module.exports = PortfolioChart;
