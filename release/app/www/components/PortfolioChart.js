/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var LineSeries = require('./LineSeries');
var ChartRow = require('./ChartRow');
var PortfolioChart = (function (_super) {
    __extends(PortfolioChart, _super);
    function PortfolioChart() {
        _super.apply(this, arguments);
        this.xPortfolioAccessor = function (d) { return d.dateTime; };
        this.yPortfolioAccessor = function (d) { return d.value; };
    }
    PortfolioChart.prototype.render = function () {
        return (React.createElement(ChartRow, React.__spread({"title": 'Portfolio', "clipPath": 'clipPortfolio', "yDomainPadding": 0.2, "data": this.props.portfolio, "xAccessor": this.xPortfolioAccessor, "yAccessor": this.yPortfolioAccessor, "yTickFormat": PortfolioChart.yTickFormat}, this.props), React.createElement(LineSeries, {"className": 'mdl-color-text--orange', "data": this.props.portfolio, "xAccessor": this.xPortfolioAccessor, "yAccessor": this.yPortfolioAccessor})));
    };
    PortfolioChart.yTickFormat = d3.format(',.2f');
    return PortfolioChart;
})(React.Component);
module.exports = PortfolioChart;
