/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var moment = require('moment');
var Quote = require('../../../documents/Quote');
var MonitoringActions = require('../actions/MonitoringActions');
var QuotesStore = require('../stores/QuotesStore');
var WindowStore = require('../stores/WindowStore');
var XAxis = require('./XAxis');
var YAxis = require('./YAxis');
var LineSeries = require('./LineSeries');
var Cursor = require('./Cursor');
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart(props) {
        var _this = this;
        _super.call(this, props);
        this.xScale = d3.time.scale();
        this.yScale = d3.scale.linear();
        this.onZoom = function () { return setTimeout(function () {
            var data = _this.state.data, domain = _this.xScale.domain();
            if (domain[0] < data[0].dateTime) {
                MonitoringActions.get(domain[0]);
            }
            else if (domain[1] > data[data.length - 1].dateTime) {
                MonitoringActions.get(domain[1]);
            }
            _this.forceUpdate();
        }, 0); }; // Force wait UI refresh (improve UI performance)
        this.onChange = function () { return _this.setState(_this.stateFromStores); };
        MonitoringActions.getLast();
        this.state = this.stateFromStores;
    }
    Object.defineProperty(Chart.prototype, "stateFromStores", {
        get: function () {
            return {
                data: QuotesStore.data,
                width: WindowStore.width,
                height: WindowStore.height
            };
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.componentDidMount = function () {
        QuotesStore.addChangeListener(this.onChange);
        WindowStore.addChangeListener(this.onChange);
    };
    Chart.prototype.componentWillUnmount = function () {
        QuotesStore.removeChangeListener(this.onChange);
        WindowStore.removeChangeListener(this.onChange);
    };
    Chart.prototype.render = function () {
        if (!this.state.data)
            return React.createElement("span", null, "Loading data...");
        var margin = this.props.margin, contentWidth = this.state.width - margin.left - margin.right, contentHeight = this.state.height - margin.top - margin.bottom;
        this.updateXScale(contentWidth);
        this.updateYScale(contentHeight);
        return (React.createElement("svg", {"width": this.state.width, "height": this.state.height}, React.createElement("g", {"transform": 'translate(' + margin.left + ', ' + margin.top + ')'}, React.createElement('clipPath', { id: 'clip' }, React.createElement("rect", {"width": contentWidth, "height": contentHeight})) /* TSX doesn't know clipPath element */, React.createElement(XAxis, {"height": contentHeight, "scale": this.xScale}), React.createElement(YAxis, {"width": contentWidth, "scale": this.yScale}), React.createElement(LineSeries, {"data": this.state.data, "xScale": this.xScale, "yScale": this.yScale, "clipPath": 'url(#clip)'}), React.createElement(Cursor, {"data": this.state.data, "width": contentWidth, "height": contentHeight, "xScale": this.xScale, "yScale": this.yScale, "onZoom": this.onZoom}))));
    };
    Chart.prototype.updateXScale = function (width) {
        var domain = this.xScale.domain();
        this.xScale.range([0, width]); // range() wants Dates which is wrong
        if (+domain[0] == 0 && +domain[1] == 1) {
            var lastQuote = this.state.data[this.state.data.length - 1];
            this.xScale.domain([
                moment(lastQuote.dateTime).subtract({ hours: 2 }).toDate(),
                lastQuote.dateTime
            ]).nice();
        }
    };
    Chart.prototype.updateYScale = function (height) {
        var domain = this.xScale.domain(), i = Quote.bisect(this.state.data, domain[0], 1), j = Quote.bisect(this.state.data, domain[1], i + 1), extent = d3.extent(this.state.data.slice(i - 1, j + 1), function (d) { return d.close; });
        this.yScale.range([height, 0]);
        if (extent[0] != extent[1]) {
            this.yScale.domain(extent).nice();
        }
    };
    return Chart;
})(React.Component);
var Chart;
(function (Chart) {
    Chart.defaultProps = {
        margin: { top: 20, right: 50, bottom: 30, left: 20 }
    };
})(Chart || (Chart = {}));
module.exports = Chart;
