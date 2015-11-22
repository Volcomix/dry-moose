/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var Margin = require('./common/Margin');
var MonitoringActions = require('../actions/MonitoringActions');
var MonitoringStore = require('../stores/MonitoringStore');
var QuotesChart = require('./QuotesChart');
var PortfolioChart = require('./PortfolioChart');
var ChartControls = require('./ChartControls');
var Loading = require('./Loading');
var Charts = (function (_super) {
    __extends(Charts, _super);
    function Charts(props) {
        var _this = this;
        _super.call(this, props);
        this.xScale = d3.time.scale();
        this.zoom = d3.behavior.zoom();
        this.onChange = function () { return _this.setState(_this.chartsState); };
        this.onZoom = function () { return setTimeout(function () {
            var domain = _this.xScale.domain();
            if (domain[0] < _this.state.monitoringData.startDate) {
                MonitoringActions.get(domain[0]);
            }
            else if (domain[1] > _this.state.monitoringData.endDate) {
                MonitoringActions.get(domain[1]);
            }
            _this.onChange();
        }, 0); }; // Force wait UI refresh (improve UI performance)
        this.zoom.scaleExtent(this.props.zoomScaleExtent);
        this.state = this.chartsState;
    }
    Object.defineProperty(Charts.prototype, "mainWidth", {
        get: function () {
            return this.mainContainer && this.mainContainer.offsetWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Charts.prototype, "quotesChartHeight", {
        get: function () {
            return this.quotesChartContainer && this.quotesChartContainer.offsetHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Charts.prototype, "portfolioChartHeight", {
        get: function () {
            return this.portfolioChartContainer && this.portfolioChartContainer.offsetHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Charts.prototype, "chartsState", {
        get: function () {
            return {
                monitoringData: MonitoringStore.data,
                resetXDomain: MonitoringStore.resetXDomain,
                mainWidth: this.mainWidth,
                quotesChartHeight: this.quotesChartHeight,
                portfolioChartHeight: this.portfolioChartHeight
            };
        },
        enumerable: true,
        configurable: true
    });
    Charts.prototype.componentDidMount = function () {
        MonitoringStore.addChangeListener(this.onChange);
        window.addEventListener('resize', this.onChange);
        this.zoom.on('zoom', this.onZoom);
        this.onChange();
    };
    Charts.prototype.componentWillUnmount = function () {
        MonitoringStore.removeChangeListener(this.onChange);
        window.removeEventListener('resize', this.onChange);
        this.zoom.on('zoom', null);
    };
    Charts.prototype.render = function () {
        var _this = this;
        var quotesChart, portfolioChart, controls, loading;
        if (this.state.monitoringData) {
            this.updateXScale();
            quotesChart = (React.createElement(QuotesChart, {"quotes": this.state.monitoringData.quotes, "options": this.state.monitoringData.options, "width": this.state.mainWidth, "height": this.state.quotesChartHeight, "margin": this.props.margin, "xScale": this.xScale, "zoom": this.zoom}));
            portfolioChart = (React.createElement(PortfolioChart, {"portfolio": this.state.monitoringData.portfolio, "width": this.state.mainWidth, "height": this.state.portfolioChartHeight, "margin": this.props.margin, "xScale": this.xScale, "zoom": this.zoom}));
            controls = React.createElement(ChartControls, null);
        }
        else {
            loading = React.createElement(Loading, null);
        }
        return (React.createElement("div", {"style": { height: '100%' }, "ref": function (ref) { return _this.mainContainer = ref; }}, React.createElement("div", {"className": 'quotes', "ref": function (ref) { return _this.quotesChartContainer = ref; }}, quotesChart), React.createElement("div", {"className": 'portfolio', "ref": function (ref) { return _this.portfolioChartContainer = ref; }}, portfolioChart), controls, loading));
    };
    Charts.prototype.updateXScale = function () {
        var margin = this.props.margin, contentWidth = this.state.mainWidth - margin.left - margin.right, domain = this.xScale.domain();
        this.xScale.range([0, contentWidth]); // range() wants Dates which is wrong
        if (this.state.resetXDomain) {
            this.xScale.domain(this.state.resetXDomain);
            this.zoom.x(this.xScale);
        }
    };
    return Charts;
})(React.Component);
var Charts;
(function (Charts) {
    Charts.defaultProps = {
        margin: Margin.defaultMargin,
        zoomScaleExtent: [0.5, 10]
    };
})(Charts || (Charts = {}));
module.exports = Charts;
