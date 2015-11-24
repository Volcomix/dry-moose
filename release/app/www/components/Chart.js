/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var MonitoringStore = require('../stores/MonitoringStore');
var QuotesChart = require('./QuotesChart');
var XAxis = require('./XAxis');
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart(props) {
        var _this = this;
        _super.call(this, props);
        this.xScale = d3.time.scale();
        this.onChange = function () { return _this.setState(_this.chartState); };
        this.state = this.chartState;
    }
    Object.defineProperty(Chart.prototype, "chartState", {
        get: function () {
            var rect = this.svg && this.svg.getBoundingClientRect();
            return {
                monitoringData: MonitoringStore.data,
                resetXDomain: MonitoringStore.resetXDomain,
                width: rect ? rect.width : 0,
                height: rect ? rect.height : 0
            };
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.componentDidMount = function () {
        MonitoringStore.addChangeListener(this.onChange);
        window.addEventListener('resize', this.onChange);
        this.onChange();
    };
    Chart.prototype.componentWillUnmount = function () {
        MonitoringStore.removeChangeListener(this.onChange);
        window.removeEventListener('resize', this.onChange);
    };
    Chart.prototype.render = function () {
        var _this = this;
        var content;
        if (this.state.monitoringData) {
            var margin = Chart.margin, width = this.state.width - margin.left - margin.right, height = this.state.height - margin.top - margin.bottom, dividerY = height / 2;
            content = (React.createElement("g", {"transform": 'translate(' + margin.left + ', ' + margin.top + ')'}, React.createElement(QuotesChart, {"quotes": this.state.monitoringData.quotes, "gains": this.state.monitoringData.gains, "width": width, "height": dividerY, "xScale": this.xScale}), React.createElement("g", {"transform": 'translate(0, ' + dividerY + ')'}), React.createElement(XAxis, {"monitoringData": this.state.monitoringData, "resetXDomain": this.state.resetXDomain, "width": width, "height": height, "scale": this.xScale})));
        }
        return (React.createElement("svg", {"ref": function (ref) { return _this.svg = ref; }}, content));
    };
    Chart.margin = { top: 20, right: 60, bottom: 30, left: 20 };
    return Chart;
})(React.Component);
module.exports = Chart;
