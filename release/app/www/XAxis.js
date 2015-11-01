/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var XAxis = (function (_super) {
    __extends(XAxis, _super);
    function XAxis(props) {
        _super.call(this, props);
        this.axis = d3.svg.axis()
            .tickFormat(d3.time.format.multi([
            ['.%L', function (d) { return d.getMilliseconds(); }],
            [':%S', function (d) { return d.getSeconds(); }],
            ['%H:%M', function (d) { return d.getMinutes(); }],
            ['%H:%M', function (d) { return d.getHours(); }],
            ['%a %d', function (d) { return d.getDay() && d.getDate() != 1; }],
            ['%b %d', function (d) { return d.getDate() != 1; }],
            ['%B', function (d) { return d.getMonth(); }],
            ['%Y', function (d) { return true; }]
        ]))
            .orient('bottom');
        this.axis.scale(this.props.scale);
    }
    XAxis.prototype.render = function () {
        var _this = this;
        this.axis.tickSize(-this.props.height, 0);
        return (React.createElement("g", {"className": 'x axis', "transform": 'translate(0, ' + this.props.height + ')', "ref": function (ref) { return d3.select(ref).call(_this.axis); }}));
    };
    return XAxis;
})(React.Component);
module.exports = XAxis;
