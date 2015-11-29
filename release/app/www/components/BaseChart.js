/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var LineSeries = require('./LineSeries');
var Cursor = require('./Cursor');
var BaseChart = (function (_super) {
    __extends(BaseChart, _super);
    function BaseChart() {
        _super.apply(this, arguments);
    }
    BaseChart.prototype.render = function () {
        var margin = {}, //this.props.margin,
        contentWidth = this.props.width - margin.left - margin.right, contentHeight = this.props.height - margin.top - margin.bottom;
        this.updateYScale(contentHeight);
        return (React.createElement("div", {"className": 'chart'}, React.createElement("div", {"className": 'mdl-typography--title mdl-color-text--grey-700'}, this.props.title), React.createElement("svg", {"width": this.props.width, "height": this.props.height}, React.createElement("g", {"transform": 'translate(' + margin.left + ', ' + margin.top + ')'}, React.createElement('clipPath', { id: this.props.clipPath }, React.createElement("rect", {"width": contentWidth, "height": contentHeight})) /* TSX doesn't know clipPath element */, React.createElement(LineSeries, {"data": this.props.data, "xAccessor": this.props.xAccessor, "yAccessor": this.props.yAccessor, "xScale": this.props.xScale, "yScale": this.props.yScale, "clipPath": this.props.clipPath}), this.props.children, React.createElement(Cursor, {"data": this.props.data, "xAccessor": this.props.xAccessor, "width": contentWidth, "height": contentHeight, "xScale": this.props.xScale, "yScale": this.props.yScale, "zoom": null /*this.props.zoom*/})))));
    };
    BaseChart.prototype.updateYScale = function (height) {
        var bisect = d3.bisector(this.props.xAccessor).left, domain = this.props.xScale.domain(), i = bisect(this.props.data, domain[0], 1), j = bisect(this.props.data, domain[1], i + 1), domainData = this.props.data.slice(i - 1, j + 1), extent = d3.extent(domainData, this.props.yAccessor);
        this.props.yScale.range([height, 0]);
        if (extent[0] != extent[1]) {
            var padding = this.props.yDomainPadding * (extent[1] - extent[0]);
            this.props.yScale.domain([extent[0] - padding, extent[1] + padding]).nice();
        }
    };
    return BaseChart;
})(React.Component);
var BaseChart;
(function (BaseChart) {
    BaseChart.defaultProps = {
        data: undefined,
        xAccessor: undefined,
        yAccessor: undefined,
        width: undefined,
        height: undefined,
        //margin: undefined,
        xScale: undefined,
        yScale: undefined,
        yTickFormat: undefined,
        clipPath: undefined,
        zoom: undefined,
        yDomainPadding: 0.1
    };
})(BaseChart || (BaseChart = {}));
module.exports = BaseChart;
