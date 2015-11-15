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
            .scale(this.props.scale);
    }
    YAxis.prototype.render = function () {
        var _this = this;
        this.axis.tickSize(-this.props.width, 0);
        return (React.createElement("g", {"className": 'y axis', "transform": 'translate(' + this.props.width + ', 0)', "ref": function (ref) { return d3.select(ref).call(_this.axis); }}));
    };
    return YAxis;
})(React.Component);
module.exports = YAxis;
