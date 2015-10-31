/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');
var Svg = (function (_super) {
    __extends(Svg, _super);
    function Svg() {
        _super.apply(this, arguments);
    }
    Svg.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height, margin = _a.margin;
        return (React.createElement("svg", {"width": width, "height": height}, React.createElement(Chart, {"width": width - margin.left - margin.right, "height": height - margin.top - margin.bottom, "margin": margin})));
    };
    Svg.defaultProps = {
        width: 800,
        height: 600,
        margin: { top: 20, right: 50, bottom: 30, left: 20 }
    };
    return Svg;
})(React.Component);
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart() {
        _super.apply(this, arguments);
    }
    Chart.prototype.render = function () {
        return (React.createElement("g", {"transform": 'translate(' +
            this.props.margin.left + ', ' +
            this.props.margin.top +
            ')'}, React.createElement(XAxis, {"width": this.props.width, "height": this.props.height}), React.createElement(YAxis, {"width": this.props.width, "height": this.props.height})));
    };
    return Chart;
})(React.Component);
var XAxis = (function (_super) {
    __extends(XAxis, _super);
    function XAxis() {
        _super.apply(this, arguments);
        this.scale = d3.time.scale();
        this.axis = d3.svg.axis()
            .scale(this.scale)
            .tickFormat(d3.time.format.multi([
            ['.%L', function (d) { return d.getMilliseconds(); }],
            [':%S', function (d) { return d.getSeconds(); }],
            ['%H:%M', function (d) { return d.getMinutes(); }],
            ['%H:%M', function (d) { return d.getHours(); }],
            ['%a %d', function (d) { return d.getDay() && d.getDate() != 1; }],
            ['%b %d', function (d) { return d.getDate() != 1; }],
            ['%B', function (d) { return d.getMonth(); }],
            ['%Y', function () { return true; }]
        ]))
            .orient('bottom');
    }
    XAxis.prototype.render = function () {
        var _this = this;
        this.axis.tickSize(-this.props.height, 0);
        this.scale.range([0, this.props.width]);
        return (React.createElement("g", {"className": 'x axis', "transform": 'translate(0, ' + this.props.height + ')', "ref": function (ref) { return d3.select(ref).call(_this.axis); }}));
    };
    return XAxis;
})(React.Component);
var YAxis = (function (_super) {
    __extends(YAxis, _super);
    function YAxis() {
        _super.apply(this, arguments);
        this.scale = d3.scale.linear();
        this.axis = d3.svg.axis()
            .scale(this.scale)
            .tickFormat(d3.format(',.5f'))
            .orient('right');
    }
    YAxis.prototype.render = function () {
        var _this = this;
        this.axis.tickSize(-this.props.width, 0);
        this.scale.range([this.props.height, 0]);
        return (React.createElement("g", {"className": 'y axis', "transform": 'translate(' + this.props.width + ', 0)', "ref": function (ref) { return d3.select(ref).call(_this.axis); }}));
    };
    return YAxis;
})(React.Component);
ReactDOM.render(React.createElement(Svg, null), document.getElementById('chart'));
