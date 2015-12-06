/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var HistoSeries = (function (_super) {
    __extends(HistoSeries, _super);
    function HistoSeries() {
        var _this = this;
        _super.apply(this, arguments);
        this.getHisto = function (d) {
            var x = _this.props.xScale(_this.props.xAccessor(d));
            return (React.createElement("line", {"key": +_this.props.xAccessor(d), "x1": x, "x2": x, "y1": _this.props.yScale(0), "y2": _this.props.yScale(_this.props.yAccessor(d))}));
        };
    }
    HistoSeries.prototype.render = function () {
        return (React.createElement("g", {"className": 'histo ' + this.props.className, "clipPath": 'url(#' + this.props.clipPath + ')'}, this.props.data.map(this.getHisto)));
    };
    return HistoSeries;
})(React.Component);
module.exports = HistoSeries;
