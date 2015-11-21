/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ChartConstants = require('../constants/ChartConstants');
var TrendingSeries = (function (_super) {
    __extends(TrendingSeries, _super);
    function TrendingSeries() {
        var _this = this;
        _super.apply(this, arguments);
        this.getTrends = function (option) {
            var accessor = _this.props.directionAccessor, direction = TrendingSeries.Direction[accessor(option)].toLowerCase(), x1 = _this.props.xScale(_this.props.xAccessor(option)), x2 = _this.props.xScale(_this.props.expirationAccessor(option)), y = _this.props.yScale(_this.props.yAccessor(option));
            return (React.createElement("g", {"key": +_this.props.xAccessor(option), "transform": 'translate(' + x1 + ', ' + y + ')'}, React.createElement("text", {"className": 'material-icons'}, 'trending_' + direction), React.createElement("circle", {r: 4.5}), React.createElement("line", {"x2": x2 - x1})));
        };
    }
    TrendingSeries.prototype.render = function () {
        return React.createElement('g', {
            className: 'trending',
            clipPath: 'url(#' + ChartConstants.clipPath + ')'
        }, this.props.data.map(this.getTrends)); // TSX doesn't know clipPath attribute
    };
    return TrendingSeries;
})(React.Component);
var TrendingSeries;
(function (TrendingSeries) {
    (function (Direction) {
        Direction[Direction["Up"] = 0] = "Up";
        Direction[Direction["Down"] = 1] = "Down";
    })(TrendingSeries.Direction || (TrendingSeries.Direction = {}));
    var Direction = TrendingSeries.Direction;
})(TrendingSeries || (TrendingSeries = {}));
module.exports = TrendingSeries;
