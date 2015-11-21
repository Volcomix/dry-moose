/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var BinaryOption = require('../../../documents/options/BinaryOption');
var Chart = require('./Chart');
var TrendingSeries = require('./TrendingSeries');
var QuotesChart = (function (_super) {
    __extends(QuotesChart, _super);
    function QuotesChart() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.xAccessor = function (d) { return d.dateTime; };
        this.yAccessor = function (d) { return d.close; };
        this.directionAccessor = function (d) {
            switch (d.direction) {
                case BinaryOption.Direction.Call:
                    return TrendingSeries.Direction.Up;
                case BinaryOption.Direction.Put:
                    return TrendingSeries.Direction.Down;
            }
        };
    }
    QuotesChart.prototype.render = function () {
        var margin = this.props.margin;
        this.updateYScale(this.props.height - margin.top - margin.bottom);
        return (React.createElement(Chart, {"title": 'Euro/U.S. Dollar', "data": this.props.quotes, "xAccessor": this.xAccessor, "yAccessor": this.yAccessor, "width": this.props.width, "height": this.props.height, "margin": this.props.margin, "xScale": this.props.xScale, "yScale": this.yScale, "yTickFormat": QuotesChart.yTickFormat, "zoom": this.props.zoom}, React.createElement(TrendingSeries, {"data": this.props.options, "xAccessor": function (d) { return d.quote.dateTime; }, "yAccessor": function (d) { return d.quote.close; }, "directionAccessor": this.directionAccessor, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": 'url(#clip)'})));
    };
    QuotesChart.prototype.updateYScale = function (height) {
        var bisect = d3.bisector(this.xAccessor).left, domain = this.props.xScale.domain(), i = bisect(this.props.quotes, domain[0], 1), j = bisect(this.props.quotes, domain[1], i + 1), domainData = this.props.quotes.slice(i - 1, j + 1), extent = d3.extent(domainData, this.yAccessor);
        this.yScale.range([height, 0]);
        if (extent[0] != extent[1]) {
            var padding = this.props.yDomainPadding * (extent[1] - extent[0]);
            this.yScale.domain([extent[0] - padding, extent[1] + padding]).nice();
        }
    };
    QuotesChart.yTickFormat = d3.format(',.5f');
    return QuotesChart;
})(React.Component);
var QuotesChart;
(function (QuotesChart) {
    QuotesChart.defaultProps = {
        options: undefined,
        quotes: undefined,
        width: undefined,
        height: undefined,
        margin: undefined,
        xScale: undefined,
        zoom: undefined,
        yDomainPadding: 0.1
    };
})(QuotesChart || (QuotesChart = {}));
module.exports = QuotesChart;
