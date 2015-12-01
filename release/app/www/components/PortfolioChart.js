/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var LineSeries = require('./LineSeries');
var YAxis = require('./YAxis');
var PortfolioChart = (function (_super) {
    __extends(PortfolioChart, _super);
    function PortfolioChart() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.xAccessor = function (d) { return d.dateTime; };
        this.yAccessor = function (d) { return d.value; };
    }
    PortfolioChart.prototype.render = function () {
        this.updateYScale();
        return (React.createElement("g", {"className": 'portfolio'}, React.createElement("text", {"className": 'mdl-typography--title mdl-color-text--grey-700'}, "Portfolio"), React.createElement('clipPath', { id: PortfolioChart.clipPath }, React.createElement("rect", {"width": this.props.width, "height": this.props.height})) /* TSX doesn't know clipPath element */, React.createElement(LineSeries, {"data": this.props.portfolio, "xAccessor": this.xAccessor, "yAccessor": this.yAccessor, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": PortfolioChart.clipPath}), React.createElement(YAxis, {"width": this.props.width, "height": this.props.height, "scale": this.yScale, "zoom": this.props.zoom, "clipPath": PortfolioChart.clipPath + 'Axis', "tickFormat": PortfolioChart.yTickFormat})));
    };
    PortfolioChart.prototype.updateYScale = function () {
        var bisect = d3.bisector(this.xAccessor).left, domain = this.props.xScale.domain(), i = bisect(this.props.portfolio, domain[0], 1), j = bisect(this.props.portfolio, domain[1], i + 1), domainData = this.props.portfolio.slice(i - 1, j + 1), extent = d3.extent(domainData, this.yAccessor);
        this.yScale.range([this.props.height, 0]);
        if (extent[0] != extent[1]) {
            var padding = PortfolioChart.yDomainPadding * (extent[1] - extent[0]);
            this.yScale.domain([extent[0] - padding, extent[1] + padding]);
        }
    };
    PortfolioChart.yTickFormat = d3.format(',.2f');
    PortfolioChart.yDomainPadding = 0.2;
    PortfolioChart.clipPath = 'clipPortfolio';
    return PortfolioChart;
})(React.Component);
module.exports = PortfolioChart;
