/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var QuotesChart = require('./QuotesChart');
var PortfolioChart = require('./PortfolioChart');
var Charts = (function (_super) {
    __extends(Charts, _super);
    function Charts(props) {
        var _this = this;
        _super.call(this, props);
        this.onResize = function () { return _this.setState({
            quotesChartWidth: _this.quotesChartContainer.offsetWidth,
            quotesChartHeight: _this.quotesChartContainer.offsetHeight
        }); };
        this.state = {
            quotesChartWidth: undefined,
            quotesChartHeight: undefined
        };
    }
    Charts.prototype.componentDidMount = function () {
        window.addEventListener('resize', this.onResize);
        this.onResize();
    };
    Charts.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.onResize);
    };
    Charts.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {"style": { height: '100%' }}, React.createElement("div", {"style": { height: '50%' }, "ref": function (ref) { return _this.quotesChartContainer = ref; }}, React.createElement(QuotesChart, {"width": this.state.quotesChartWidth, "height": this.state.quotesChartHeight})), React.createElement("div", {"style": { height: '50%' }}, React.createElement(PortfolioChart, null))));
    };
    return Charts;
})(React.Component);
module.exports = Charts;
