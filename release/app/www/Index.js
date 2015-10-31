/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart() {
        _super.apply(this, arguments);
        this.xScale = d3.time.scale();
        this.yScale = d3.scale.linear();
    }
    Chart.prototype.render = function () {
        var _a = this.props, data = _a.data, containerWidth = _a.containerWidth, containerHeight = _a.containerHeight, margin = _a.margin;
        var width = containerWidth - margin.left - margin.right;
        var height = containerHeight - margin.top - margin.bottom;
        this.xScale
            .range([0, width])
            .domain([data[0].dateTime, data[data.length - 1].dateTime])
            .nice();
        this.yScale
            .range([height, 0])
            .domain(d3.extent(data, function (d) { return d.close; }))
            .nice();
        return (React.createElement("svg", {"width": containerWidth, "height": containerHeight}, React.createElement("g", {"transform": 'translate(' + margin.left + ', ' + margin.top + ')'}, React.createElement(XAxis, {"width": width, "height": height, "scale": this.xScale}), React.createElement(YAxis, {"width": width, "height": height, "scale": this.yScale}), React.createElement(LineSeries, {"data": data, "xScale": this.xScale, "yScale": this.yScale}))));
    };
    Chart.defaultProps = {
        containerWidth: 800,
        containerHeight: 600,
        margin: { top: 20, right: 50, bottom: 30, left: 20 }
    };
    return Chart;
})(React.Component);
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
var YAxis = (function (_super) {
    __extends(YAxis, _super);
    function YAxis(props) {
        _super.call(this, props);
        this.axis = d3.svg.axis()
            .tickFormat(d3.format(',.5f'))
            .orient('right');
        this.axis.scale(this.props.scale);
    }
    YAxis.prototype.render = function () {
        var _this = this;
        this.axis.tickSize(-this.props.width, 0);
        return (React.createElement("g", {"className": 'y axis', "transform": 'translate(' + this.props.width + ', 0)', "ref": function (ref) { return d3.select(ref).call(_this.axis); }}));
    };
    return YAxis;
})(React.Component);
var LineSeries = (function (_super) {
    __extends(LineSeries, _super);
    function LineSeries(props) {
        var _this = this;
        _super.call(this, props);
        this.line = d3.svg.line();
        this.line
            .x(function (d) { return _this.props.xScale(d.dateTime); })
            .y(function (d) { return _this.props.yScale(d.close); });
    }
    LineSeries.prototype.render = function () {
        return (React.createElement("path", {"className": 'line', d: this.line(this.props.data)}));
    };
    return LineSeries;
})(React.Component);
var data = [
    { dateTime: new Date('2015-10-20T10:00:00Z'), close: 1.12 },
    { dateTime: new Date('2015-10-20T11:00:00Z'), close: 1.20 },
    { dateTime: new Date('2015-10-20T12:00:00Z'), close: 1.16 },
    { dateTime: new Date('2015-10-20T13:00:00Z'), close: 1.35 }
];
ReactDOM.render(React.createElement(Chart, {"data": data}), document.getElementById('chart'));
