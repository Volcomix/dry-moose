/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var LineSeries = require('./LineSeries');
var GainSeries = require('./GainSeries');
var ChartRow = require('./ChartRow');
var QuotesChart = (function (_super) {
    __extends(QuotesChart, _super);
    function QuotesChart() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.xQuoteAccessor = function (d) { return d.dateTime; };
        this.yQuoteAccessor = function (d) { return d.close; };
    }
    QuotesChart.prototype.render = function () {
        this.updateYScale();
        return (React.createElement(ChartRow, {"title": 'Euro/U.S. Dollar', y: this.props.y, "width": this.props.width, "height": this.props.height, "yScale": this.yScale, "zoom": this.props.zoom, "clipPath": QuotesChart.clipPath, "yTickFormat": QuotesChart.yTickFormat}, React.createElement(LineSeries, {"data": this.props.quotes, "xAccessor": this.xQuoteAccessor, "yAccessor": this.yQuoteAccessor, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": QuotesChart.clipPath}), React.createElement(GainSeries, {"gains": this.props.gains, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": QuotesChart.clipPath})));
    };
    QuotesChart.prototype.updateYScale = function () {
        var bisect = d3.bisector(this.xQuoteAccessor).left, domain = this.props.xScale.domain(), i = bisect(this.props.quotes, domain[0], 1), j = bisect(this.props.quotes, domain[1], i + 1), domainData = this.props.quotes.slice(i - 1, j + 1), extent = d3.extent(domainData, this.yQuoteAccessor);
        this.yScale.range([this.props.height, 0]);
        if (extent[0] != extent[1]) {
            var padding = QuotesChart.yDomainPadding * (extent[1] - extent[0]);
            this.yScale.domain([extent[0] - padding, extent[1] + padding]);
        }
    };
    QuotesChart.yTickFormat = d3.format(',.5f');
    QuotesChart.yDomainPadding = 0.1;
    QuotesChart.clipPath = 'clipQuotes';
    return QuotesChart;
})(React.Component);
module.exports = QuotesChart;
