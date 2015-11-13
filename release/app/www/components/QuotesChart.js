/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var MonitoringStore = require('../stores/MonitoringStore');
var Chart = require('./Chart');
var QuotesChart = (function (_super) {
    __extends(QuotesChart, _super);
    function QuotesChart(props) {
        var _this = this;
        _super.call(this, props);
        this.onChange = function () { return _this.setState(_this.stateFromStores); };
        this.state = this.stateFromStores;
    }
    Object.defineProperty(QuotesChart.prototype, "stateFromStores", {
        get: function () {
            return {
                quotes: MonitoringStore.quotes
            };
        },
        enumerable: true,
        configurable: true
    });
    QuotesChart.prototype.componentDidMount = function () {
        MonitoringStore.addChangeListener(this.onChange);
    };
    QuotesChart.prototype.componentWillUnmount = function () {
        MonitoringStore.removeChangeListener(this.onChange);
    };
    QuotesChart.prototype.render = function () {
        return (React.createElement(Chart, {"data": this.state.quotes, "xAccessor": function (d) { return d.dateTime; }, "yAccessor": function (d) { return d.close; }, "width": this.props.width, "height": this.props.height, "xScale": this.props.xScale, "zoom": this.props.zoom}));
    };
    return QuotesChart;
})(React.Component);
module.exports = QuotesChart;