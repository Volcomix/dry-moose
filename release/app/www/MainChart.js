/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var Chart = require('./Chart');
var Axis = require('./Axis');
var LineSeries = require('./LineSeries');
var TimeFormat = require('./TimeFormat');
var MainChart = (function (_super) {
    __extends(MainChart, _super);
    function MainChart() {
        var _this = this;
        _super.apply(this, arguments);
        this.xScale = d3.time.scale();
        this.yScale = d3.scale.linear();
        this.xTickFormat = TimeFormat.multi();
        this.yTickFormat = d3.format(',.5f');
        this.handleResize = function () {
            _this.setState({
                width: _this.chart.offsetWidth,
                height: _this.chart.offsetHeight
            });
        };
    }
    MainChart.prototype.componentDidMount = function () {
        window.addEventListener('resize', this.handleResize);
    };
    MainChart.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.handleResize);
    };
    MainChart.prototype.render = function () {
        var _this = this;
        if (!this.state) {
            return (React.createElement("div", {"ref": function (ref) { return ref && _this.setState({
                width: ref.offsetWidth,
                height: ref.offsetHeight
            }); }, "className": 'chart'}));
        }
        var margin = this.props.margin;
        var innerWidth = this.state.width - margin.left - margin.right;
        var innerHeight = this.state.height - margin.top - margin.bottom;
        this.xScale.range([0, innerWidth]);
        this.yScale.range([innerHeight, 0]);
        return (React.createElement("div", {"ref": function (ref) { return _this.chart = ref; }, "className": 'chart'}, React.createElement(Chart, {"width": this.state.width, "height": this.state.height, "margin": this.props.margin}, React.createElement(Axis, {"className": 'x', "scale": this.xScale, "tickFormat": this.xTickFormat, "orientation": 'bottom', "innerTickSize": -innerHeight, "translateY": innerHeight}), React.createElement(Axis, {"className": 'y', "scale": this.yScale, "tickFormat": this.yTickFormat, "orientation": 'right', "innerTickSize": -innerWidth, "translateX": innerWidth}), React.createElement(LineSeries, null))));
    };
    return MainChart;
})(React.Component);
var MainChart;
(function (MainChart) {
    MainChart.defaultProps = {
        margin: {
            top: 20,
            right: 50,
            bottom: 30,
            left: 20
        }
    };
})(MainChart || (MainChart = {}));
module.exports = MainChart;
