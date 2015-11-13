/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var MonitoringActions = require('../actions/MonitoringActions');
var MonitoringStore = require('../stores/MonitoringStore');
var QuotesChart = require('./QuotesChart');
var PortfolioChart = require('./PortfolioChart');
var Charts = (function (_super) {
    __extends(Charts, _super);
    function Charts(props) {
        var _this = this;
        _super.call(this, props);
        this.xScale = d3.time.scale();
        this.zoom = d3.behavior.zoom();
        this.onResize = function () { return _this.setState({
            mainWidth: _this.mainContainer.offsetWidth,
            quotesChartHeight: _this.quotesChartContainer.offsetHeight,
            portfolioChartHeight: _this.portfolioChartContainer.offsetHeight
        }); };
        this.onZoom = function () { return setTimeout(function () {
            var domain = _this.xScale.domain();
            if (domain[0] < MonitoringStore.startDate) {
                MonitoringActions.get(domain[0]);
            }
            else if (domain[1] > MonitoringStore.endDate) {
                MonitoringActions.get(domain[1]);
            }
            _this.forceUpdate();
        }, 0); }; // Force wait UI refresh (improve UI performance)
        this.zoom.scaleExtent(this.props.zoomScaleExtent);
        this.state = {
            mainWidth: undefined,
            quotesChartHeight: undefined,
            portfolioChartHeight: undefined
        };
    }
    Charts.prototype.componentDidMount = function () {
        window.addEventListener('resize', this.onResize);
        this.onResize();
        this.zoom.on('zoom', this.onZoom);
    };
    Charts.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.onResize);
        this.zoom.on('zoom', null);
    };
    Charts.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {"style": { height: '100%' }, "ref": function (ref) { return _this.mainContainer = ref; }}, React.createElement("div", {"style": { height: '50%' }, "ref": function (ref) { return _this.quotesChartContainer = ref; }}, React.createElement(QuotesChart, {"width": this.state.mainWidth, "height": this.state.quotesChartHeight, "xScale": this.xScale, "zoom": this.zoom})), React.createElement("div", {"style": { height: '50%' }, "ref": function (ref) { return _this.portfolioChartContainer = ref; }}, React.createElement(PortfolioChart, {"width": this.state.mainWidth, "height": this.state.portfolioChartHeight, "xScale": this.xScale, "zoom": this.zoom}))));
    };
    return Charts;
})(React.Component);
var Charts;
(function (Charts) {
    Charts.defaultProps = {
        zoomScaleExtent: [0.5, 10]
    };
})(Charts || (Charts = {}));
module.exports = Charts;