/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var MonitoringStore = require('../stores/MonitoringStore');
var MonitoringActions = require('../actions/MonitoringActions');
var XAxis = require('./XAxis');
var QuotesChart = require('./QuotesChart');
var MACDChart = require('./MACDChart');
var PortfolioChart = require('./PortfolioChart');
var Divider = require('./Divider');
var ChartControls = require('./ChartControls');
var Loading = require('./Loading');
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart(props) {
        var _this = this;
        _super.call(this, props);
        this.xScale = d3.time.scale();
        this.zoom = d3.behavior.zoom().scaleExtent([0.5, 10]);
        this.drag = d3.behavior.drag().origin(function (d) { return d; });
        this.onChange = function () { return _this.setState(_this.chartState); };
        this.onZoom = function () {
            var domain = _this.xScale.domain();
            if (domain[0] < _this.state.monitoringData.startDate) {
                MonitoringActions.get(domain[0]);
            }
            else if (domain[1] > _this.state.monitoringData.endDate) {
                MonitoringActions.get(domain[1]);
            }
            _this.onChange();
        };
        this.onDrag = function (d) {
            var event = d3.event, height = _this.contentHeight, dividersRatio = _this.state.dividersRatio, min = d.id ? dividersRatio[d.id - 1] : 0, max = (d.id == dividersRatio.length - 1) ? 1 : dividersRatio[d.id + 1];
            dividersRatio[d.id] = Math.min(Math.max(event.y / height, min + 0.1), max - 0.1);
            _this.setState({ dividersRatio: dividersRatio });
        };
        this.state = this.chartState;
        this.state.dividersRatio = [0.4, 0.75];
    }
    Object.defineProperty(Chart.prototype, "contentWidth", {
        get: function () {
            return this.state.width - Chart.margin.left - Chart.margin.right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "contentHeight", {
        get: function () {
            return this.state.height - Chart.margin.top - Chart.margin.bottom;
        },
        enumerable: true,
        configurable: true
    });
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
        this.zoom.on('zoom', this.onZoom);
        this.drag.on('drag', this.onDrag);
        this.onChange();
    };
    Chart.prototype.componentWillUnmount = function () {
        MonitoringStore.removeChangeListener(this.onChange);
        window.removeEventListener('resize', this.onChange);
        this.zoom.on('zoom', null);
        this.drag.on('drag', null);
    };
    Object.defineProperty(Chart.prototype, "chart", {
        get: function () {
            if (this.state.monitoringData) {
                var margin = Chart.margin, width = this.contentWidth, height = this.contentHeight, dividersRatio = this.state.dividersRatio, quotesHeight = Math.round(height * dividersRatio[0]), macdHeight = Math.round(height * dividersRatio[1] - quotesHeight), portfolioHeight = height - quotesHeight - macdHeight;
                // range() wants Dates which is wrong
                this.xScale.range([0, width]);
                if (this.state.resetXDomain) {
                    this.xScale.domain(this.state.resetXDomain);
                    this.zoom.x(this.xScale);
                }
                return (React.createElement("g", {"transform": 'translate(' + margin.left + ', ' + margin.top + ')'}, React.createElement(XAxis, {"height": height, "scale": this.xScale}), React.createElement(QuotesChart, {"quotes": this.state.monitoringData.quotes, "gains": this.state.monitoringData.gains, y: 0, "width": width, "height": quotesHeight, "xScale": this.xScale, "zoom": this.zoom}), React.createElement(MACDChart, {"macd": this.state.monitoringData.macd, y: quotesHeight, "width": width, "height": macdHeight, "xScale": this.xScale, "zoom": this.zoom}), React.createElement(PortfolioChart, {"portfolio": this.state.monitoringData.portfolio, y: quotesHeight + macdHeight, "width": width, "height": portfolioHeight, "xScale": this.xScale, "zoom": this.zoom}), React.createElement(Divider, {"id": 0, y: quotesHeight, "width": width + margin.right, "drag": this.drag}), React.createElement(Divider, {"id": 1, y: quotesHeight + macdHeight, "width": width + margin.right, "drag": this.drag})));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "controls", {
        get: function () {
            if (this.state.monitoringData) {
                return React.createElement(ChartControls, null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "loading", {
        get: function () {
            if (!this.state.monitoringData) {
                return React.createElement(Loading, null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {"className": 'chart'}, React.createElement("svg", {"ref": function (ref) { return _this.svg = ref; }}, this.chart), this.controls, this.loading));
    };
    Chart.margin = { top: 20, right: 50, bottom: 30, left: 20 };
    return Chart;
})(React.Component);
module.exports = Chart;
