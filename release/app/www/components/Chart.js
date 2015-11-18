/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var XAxis = require('./XAxis');
var YAxis = require('./YAxis');
var LineSeries = require('./LineSeries');
var Cursor = require('./Cursor');
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart() {
        _super.apply(this, arguments);
    }
    Chart.prototype.render = function () {
        var margin = this.props.margin, contentWidth = this.props.width - margin.left - margin.right, contentHeight = this.props.height - margin.top - margin.bottom;
        return (React.createElement("div", {"className": 'chart'}, React.createElement("div", {"className": 'mdl-typography--title mdl-color-text--grey-700'}, this.props.title), React.createElement("svg", {"width": this.props.width, "height": this.props.height}, React.createElement("g", {"transform": 'translate(' + margin.left + ', ' + margin.top + ')'}, React.createElement('clipPath', { id: 'clip' }, React.createElement("rect", {"width": contentWidth, "height": contentHeight})) /* TSX doesn't know clipPath element */, React.createElement(XAxis, {"height": contentHeight, "scale": this.props.xScale}), React.createElement(YAxis, {"width": contentWidth, "scale": this.props.yScale, "tickFormat": this.props.yTickFormat}), React.createElement(LineSeries, {"data": this.props.data, "xAccessor": this.props.xAccessor, "yAccessor": this.props.yAccessor, "xScale": this.props.xScale, "yScale": this.props.yScale, "clipPath": 'url(#clip)'}), this.props.children, React.createElement(Cursor, {"data": this.props.data, "xAccessor": this.props.xAccessor, "width": contentWidth, "height": contentHeight, "xScale": this.props.xScale, "yScale": this.props.yScale, "zoom": this.props.zoom})))));
    };
    return Chart;
})(React.Component);
module.exports = Chart;
