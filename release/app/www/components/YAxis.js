/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var YCursor = require('./YCursor');
var YAxis = (function (_super) {
    __extends(YAxis, _super);
    function YAxis() {
        _super.apply(this, arguments);
        this.axis = d3.svg.axis().orient('right');
    }
    YAxis.prototype.render = function () {
        var _this = this;
        this.axis
            .tickFormat(this.props.tickFormat)
            .scale(this.props.scale)
            .tickSize(-this.props.width, 0);
        return (React.createElement("g", null, React.createElement('clipPath', { id: this.props.clipPath }, React.createElement("rect", {"transform": 'translate(' + -this.props.width + ', 0)', "width": this.props.width + 100, "height": this.props.height})) /* TSX doesn't know clipPath element */, React.createElement("g", {"className": 'y axis', "transform": 'translate(' + this.props.width + ', 0)', "clipPath": 'url(#' + this.props.clipPath + ')', "ref": function (ref) { return d3.select(ref).call(_this.axis); }}), React.createElement(YCursor, {"width": this.props.width, "height": this.props.height, "scale": this.props.scale, "zoom": this.props.zoom, "labelFormat": this.props.tickFormat})));
    };
    return YAxis;
})(React.Component);
module.exports = YAxis;
