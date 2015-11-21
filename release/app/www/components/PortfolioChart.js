/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var ChartProps = require('./common/ChartProps');
var Chart = require('./Chart');
var PortfolioChart = (function (_super) {
    __extends(PortfolioChart, _super);
    function PortfolioChart() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.xAccessor = function (d) { return d.dateTime; };
        this.yAccessor = function (d) { return d.value; };
    }
    PortfolioChart.prototype.render = function () {
        var margin = this.props.margin;
        this.updateYScale(this.props.height - margin.top - margin.bottom);
        return (React.createElement(Chart, {"title": 'Portfolio', "data": this.props.portfolio, "xAccessor": function (d) { return d.dateTime; }, "yAccessor": function (d) { return d.value; }, "width": this.props.width, "height": this.props.height, "margin": this.props.margin, "xScale": this.props.xScale, "yScale": this.yScale, "yTickFormat": PortfolioChart.yTickFormat, "zoom": this.props.zoom}));
    };
    PortfolioChart.prototype.updateYScale = function (height) {
        var bisect = d3.bisector(this.xAccessor).left, domain = this.props.xScale.domain(), i = bisect(this.props.portfolio, domain[0], 1), j = bisect(this.props.portfolio, domain[1], i + 1), domainData = this.props.portfolio.slice(i - 1, j + 1), extent = d3.extent(domainData, this.yAccessor);
        this.yScale.range([height, 0]);
        if (extent[0] != extent[1]) {
            var padding = this.props.yDomainPadding * (extent[1] - extent[0]);
            this.yScale.domain([extent[0] - padding, extent[1] + padding]).nice();
        }
    };
    PortfolioChart.yTickFormat = d3.format(',.2f');
    return PortfolioChart;
})(React.Component);
var PortfolioChart;
(function (PortfolioChart) {
    PortfolioChart.defaultProps = ChartProps.defaultProps;
})(PortfolioChart || (PortfolioChart = {}));
module.exports = PortfolioChart;
