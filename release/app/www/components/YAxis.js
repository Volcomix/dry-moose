/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var YAxis = (function (_super) {
    __extends(YAxis, _super);
    function YAxis(props) {
        _super.call(this, props);
        this.axis = d3.svg.axis().orient('right');
        this.axis
            .tickFormat(this.props.tickFormat)
            .scale(this.props.yScale);
    }
    YAxis.prototype.render = function () {
        var _this = this;
        this.updateYScale();
        this.axis.tickSize(-this.props.width, 0);
        return (React.createElement("g", {"className": 'y axis', "transform": 'translate(' + this.props.width + ', 0)', "ref": function (ref) { return d3.select(ref).call(_this.axis); }}));
    };
    YAxis.prototype.updateYScale = function () {
        var bisect = d3.bisector(this.props.xAccessor).left, domain = this.props.xScale.domain(), i = bisect(this.props.data, domain[0], 1), j = bisect(this.props.data, domain[1], i + 1), domainData = this.props.data.slice(i - 1, j + 1), extent = d3.extent(domainData, this.props.yAccessor);
        this.props.yScale.range([this.props.height, 0]);
        if (extent[0] != extent[1]) {
            var padding = YAxis.domainPadding * (extent[1] - extent[0]);
            this.props.yScale.domain([extent[0] - padding, extent[1] + padding]).nice();
        }
    };
    YAxis.domainPadding = 0.1;
    return YAxis;
})(React.Component);
module.exports = YAxis;
