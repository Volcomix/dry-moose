/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
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
        this.xScale
            .range([0, this.width]) // range() wants Dates which is wrong
            .domain([
            this.props.data[0].dateTime,
            this.props.data[this.props.data.length - 1].dateTime
        ])
            .nice();
    }
    Object.defineProperty(Chart.prototype, "width", {
        get: function () {
            return this.props.containerWidth -
                this.props.margin.left -
                this.props.margin.right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "height", {
        get: function () {
            return this.props.containerHeight -
                this.props.margin.top -
                this.props.margin.bottom;
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.render = function () {
        var _a = this.props, data = _a.data, containerWidth = _a.containerWidth, containerHeight = _a.containerHeight, margin = _a.margin;
        var width = this.width; // To avoid multiple substracts
        var height = this.height; // To avoid multiple substracts
        this.yScale
            .range([height, 0])
            .domain(d3.extent(data, function (d) { return d.close; }))
            .nice();
        return (React.createElement("svg", {"width": containerWidth, "height": containerHeight}, React.createElement("g", {"transform": 'translate(' + margin.left + ', ' + margin.top + ')'}, React.createElement('clipPath', { id: 'clip' }, React.createElement("rect", {"width": width, "height": height})) /* TSX doesn't know clipPath element */, React.createElement(XAxis, {"height": height, "scale": this.xScale}), React.createElement(YAxis, {"width": width, "scale": this.yScale}), React.createElement(LineSeries, {"data": data, "xScale": this.xScale, "yScale": this.yScale, "clipPath": 'url(#clip)'}), React.createElement(Cursor, {"data": data, "width": width, "height": height, "xScale": this.xScale, "yScale": this.yScale, "onZoom": this.handleZoom}))));
    };
    return Chart;
})(React.Component);
var Chart;
(function (Chart) {
    Chart.defaultProps = {
        data: undefined,
        containerWidth: 800,
        containerHeight: 600,
        margin: { top: 20, right: 50, bottom: 30, left: 20 }
    };
})(Chart || (Chart = {}));
module.exports = Chart;
