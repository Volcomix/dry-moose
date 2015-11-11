/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Chart = require('./Chart');
var QuotesChart = (function (_super) {
    __extends(QuotesChart, _super);
    function QuotesChart() {
        _super.apply(this, arguments);
    }
    QuotesChart.prototype.render = function () {
        return (React.createElement(Chart, {"width": this.props.width, "height": this.props.height}));
    };
    return QuotesChart;
})(React.Component);
module.exports = QuotesChart;
