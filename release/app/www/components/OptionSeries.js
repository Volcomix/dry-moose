/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ChartConstants = require('../constants/ChartConstants');
var OptionSeries = (function (_super) {
    __extends(OptionSeries, _super);
    function OptionSeries() {
        var _this = this;
        _super.apply(this, arguments);
        this.getTrends = function (option) {
            var accessor = _this.props.directionAccessor, direction = OptionSeries.Direction[accessor(option)].toLowerCase(), x1 = _this.props.xScale(_this.props.xAccessor(option)), x2 = _this.props.xScale(_this.props.expirationAccessor(option)), y = _this.props.yScale(_this.props.yAccessor(option));
            return (React.createElement("g", {"key": +_this.props.xAccessor(option), "transform": 'translate(' + x1 + ', ' + y + ')'}, React.createElement("text", {"className": 'material-icons'}, 'trending_' + direction), React.createElement("circle", {r: 4.5}), React.createElement("line", {"x2": x2 - x1})));
        };
    }
    OptionSeries.prototype.render = function () {
        return React.createElement('g', {
            className: 'options',
            clipPath: 'url(#' + ChartConstants.clipPath + ')'
        }, this.props.data.map(this.getTrends)); // TSX doesn't know clipPath attribute
    };
    return OptionSeries;
})(React.Component);
var OptionSeries;
(function (OptionSeries) {
    (function (Direction) {
        Direction[Direction["Up"] = 0] = "Up";
        Direction[Direction["Down"] = 1] = "Down";
    })(OptionSeries.Direction || (OptionSeries.Direction = {}));
    var Direction = OptionSeries.Direction;
})(OptionSeries || (OptionSeries = {}));
module.exports = OptionSeries;
