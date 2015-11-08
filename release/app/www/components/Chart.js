/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var Quote = require('../../../documents/Quote');
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
        this.handleZoom = function () { return _this.forceUpdate(); };
        this.handleResize = function () { return _this.setState(_this.chartState); };
        this.state = this.chartState;
        var data = this.props.data;
        this.xScale.domain([data[0].dateTime, data[data.length - 1].dateTime]).nice();
    }
    Object.defineProperty(Chart.prototype, "chartState", {
        get: function () {
            return {
                width: WindowStore.width,
                height: WindowStore.height
            };
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.componentDidMount = function () {
        WindowStore.addChangeListener(this.handleResize);
    };
    Chart.prototype.componentWillUnmount = function () {
        WindowStore.removeChangeListener(this.handleResize);
    };
    Chart.prototype.render = function () {
        var _a = this.props, data = _a.data, margin = _a.margin, contentWidth = this.state.width - margin.left - margin.right, contentHeight = this.state.height - margin.top - margin.bottom, domain = this.xScale.domain(), i = Quote.bisect(data, domain[0], 1), j = Quote.bisect(data, domain[1], i + 1), extent = d3.extent(data.slice(i - 1, j + 1), function (d) { return d.close; });
        this.xScale.range([0, contentWidth]); // range() wants Dates which is wrong
        this.yScale.range([contentHeight, 0]);
        if (extent[0] != extent[1]) {
            this.yScale.domain(extent).nice();
        }
        return (React.createElement("svg", {"width": this.state.width, "height": this.state.height}, React.createElement("g", {"transform": 'translate(' + margin.left + ', ' + margin.top + ')'}, React.createElement('clipPath', { id: 'clip' }, React.createElement("rect", {"width": contentWidth, "height": contentHeight})) /* TSX doesn't know clipPath element */, React.createElement(XAxis, {"height": contentHeight, "scale": this.xScale}), React.createElement(YAxis, {"width": contentWidth, "scale": this.yScale}), React.createElement(LineSeries, {"data": data, "xScale": this.xScale, "yScale": this.yScale, "clipPath": 'url(#clip)'}), React.createElement(Cursor, {"data": data, "width": contentWidth, "height": contentHeight, "xScale": this.xScale, "yScale": this.yScale, "onZoom": this.handleZoom}))));
    };
    return Chart;
})(React.Component);
var Chart;
(function (Chart) {
    Chart.defaultProps = {
        data: undefined,
        margin: { top: 20, right: 50, bottom: 30, left: 20 }
    };
})(Chart || (Chart = {}));
module.exports = Chart;
