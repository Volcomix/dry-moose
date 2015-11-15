/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var Chart = require('./Chart');
var QuotesChart = (function (_super) {
    __extends(QuotesChart, _super);
    function QuotesChart() {
        _super.apply(this, arguments);
    }
    QuotesChart.prototype.render = function () {
        return (React.createElement(Chart, {"title": 'Euro/U.S. Dollar', "data": this.props.quotes, "xAccessor": function (d) { return d.dateTime; }, "yAccessor": function (d) { return d.close; }, "width": this.props.width, "height": this.props.height, "margin": this.props.margin, "xScale": this.props.xScale, "yTickFormat": QuotesChart.yTickFormat, "zoom": this.props.zoom}));
    };
    QuotesChart.yTickFormat = d3.format(',.5f');
    return QuotesChart;
})(React.Component);
module.exports = QuotesChart;
