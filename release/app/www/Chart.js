/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart() {
        _super.apply(this, arguments);
    }
    Chart.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height, margin = _a.margin;
        return (React.createElement("svg", {"width": width, "height": height}, React.createElement("g", {"transform": 'translate(' + margin.left + ', ' + margin.top + ')'}, this.props.children)));
    };
    return Chart;
})(React.Component);
module.exports = Chart;
