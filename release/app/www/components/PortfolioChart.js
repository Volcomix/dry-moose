/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var MonitoringStore = require('../stores/MonitoringStore');
var Chart = require('./Chart');
var PortfolioChart = (function (_super) {
    __extends(PortfolioChart, _super);
    function PortfolioChart(props) {
        var _this = this;
        _super.call(this, props);
        this.onChange = function () { return _this.setState(_this.stateFromStores); };
        this.state = this.stateFromStores;
    }
    Object.defineProperty(PortfolioChart.prototype, "stateFromStores", {
        get: function () {
            return {
                portfolio: MonitoringStore.portfolio
            };
        },
        enumerable: true,
        configurable: true
    });
    PortfolioChart.prototype.componentDidMount = function () {
        MonitoringStore.addChangeListener(this.onChange);
    };
    PortfolioChart.prototype.componentWillUnmount = function () {
        MonitoringStore.removeChangeListener(this.onChange);
    };
    PortfolioChart.prototype.render = function () {
        return (React.createElement(Chart, {"data": this.state.portfolio, "xAccessor": function (d) { return d.dateTime; }, "yAccessor": function (d) { return d.value; }, "width": this.props.width, "height": this.props.height, "xScale": this.props.xScale, "onZoom": this.props.onZoom}));
    };
    return PortfolioChart;
})(React.Component);
module.exports = PortfolioChart;
