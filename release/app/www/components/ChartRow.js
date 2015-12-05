/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var YAxis = require('./YAxis');
var ChartRow = (function (_super) {
    __extends(ChartRow, _super);
    function ChartRow() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
    }
    Object.defineProperty(ChartRow.prototype, "series", {
        get: function () {
            var _this = this;
            return React.Children.map(this.props.children, function (child) { return (React.cloneElement(child, {
                xScale: _this.props.xScale,
                yScale: _this.yScale,
                clipPath: _this.props.clipPath
            })); });
        },
        enumerable: true,
        configurable: true
    });
    ChartRow.prototype.render = function () {
        this.updateYScale();
        return (React.createElement("g", {"transform": 'translate(0, ' + this.props.y + ')'}, React.createElement("text", {"className": 'mdl-typography--title mdl-color-text--grey-700'}, this.props.title), React.createElement('clipPath', { id: this.props.clipPath }, React.createElement("rect", {"width": this.props.width, "height": this.props.height})) /* TSX doesn't know clipPath element */, this.series, React.createElement(YAxis, {"width": this.props.width, "height": this.props.height, "scale": this.yScale, "zoom": this.props.zoom, "clipPath": this.props.clipPath + 'Axis', "tickFormat": this.props.yTickFormat})));
    };
    ChartRow.prototype.updateYScale = function () {
        var bisect = d3.bisector(this.props.xAccessor).left, domain = this.props.xScale.domain(), i = bisect(this.props.data, domain[0], 1), j = bisect(this.props.data, domain[1], i + 1), domainData = this.props.data.slice(i - 1, j + 1), extent = d3.extent(domainData, this.props.yAccessor);
        this.yScale.range([this.props.height, 0]);
        if (extent[0] != extent[1]) {
            var padding = this.props.yDomainPadding * (extent[1] - extent[0]);
            this.yScale.domain([extent[0] - padding, extent[1] + padding]);
        }
    };
    return ChartRow;
})(React.Component);
module.exports = ChartRow;
