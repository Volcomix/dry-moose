/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Chart = require('./Chart');
var MainChart = (function (_super) {
    __extends(MainChart, _super);
    function MainChart() {
        var _this = this;
        _super.apply(this, arguments);
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
            }); }, "className": "chart"}));
        }
        return (React.createElement("div", {"ref": function (ref) { return _this.chart = ref; }, "className": "chart"}, React.createElement(Chart, {"width": this.state.width, "height": this.state.height})));
    };
    return MainChart;
})(React.Component);
module.exports = MainChart;
