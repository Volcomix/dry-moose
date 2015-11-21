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
var OptionSeries = require('./OptionSeries');
var QuotesChart = (function (_super) {
    __extends(QuotesChart, _super);
    function QuotesChart() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.xQuoteAccessor = function (d) { return d.dateTime; };
        this.yQuoteAccessor = function (d) { return d.close; };
        this.xOptionAccessor = function (d) { return d.quote.dateTime; };
        this.yOptionAccessor = function (d) { return d.quote.close; };
        this.optionExpirationAccessor = function (d) { return d.expiration; };
        this.optionDirectionAccessor = function (d) {
            switch (d.direction) {
                case BinaryOption.Direction.Call:
                    return OptionSeries.Direction.Up;
                case BinaryOption.Direction.Put:
                    return OptionSeries.Direction.Down;
            }
        };
    }
    QuotesChart.prototype.render = function () {
        return (React.createElement(Chart, {"title": 'Euro/U.S. Dollar', "data": this.props.quotes, "xAccessor": this.xQuoteAccessor, "yAccessor": this.yQuoteAccessor, "width": this.props.width, "height": this.props.height, "margin": this.props.margin, "xScale": this.props.xScale, "yScale": this.yScale, "yTickFormat": QuotesChart.yTickFormat, "zoom": this.props.zoom}, React.createElement(OptionSeries, {"data": this.props.options, "xAccessor": this.xOptionAccessor, "yAccessor": this.yOptionAccessor, "expirationAccessor": this.optionExpirationAccessor, "directionAccessor": this.optionDirectionAccessor, "xScale": this.props.xScale, "yScale": this.yScale})));
    };
    QuotesChart.yTickFormat = d3.format(',.5f');
    return QuotesChart;
})(React.Component);
module.exports = QuotesChart;
