/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var BinaryOption = require('../../../documents/options/BinaryOption');
var GainSeries = (function (_super) {
    __extends(GainSeries, _super);
    function GainSeries() {
        var _this = this;
        _super.apply(this, arguments);
        this.getGains = function (gain) {
            var direction, option = gain.option, x1 = _this.props.xScale(option.quote.dateTime), x2 = _this.props.xScale(gain.quote.dateTime) - x1, y1 = _this.props.yScale(option.quote.close), y2 = _this.props.yScale(gain.quote.close) - y1;
            return (React.createElement("g", {"key": +gain.dateTime, "className": gain.value ? 'win' : 'lose', "transform": 'translate(' + x1 + ', ' + y1 + ')'}, React.createElement("text", {"className": 'material-icons'}, _this.getDirectionIcon(option)), React.createElement("circle", {r: 4.5}), React.createElement("line", {"className": 'option', "x2": x2}), React.createElement("line", {"className": 'expiration', "x1": x2, "x2": x2, "y2": y2})));
        };
    }
    GainSeries.prototype.getDirectionIcon = function (option) {
        switch (option.direction) {
            case BinaryOption.Direction.Call:
                return 'trending_up';
            case BinaryOption.Direction.Put:
                return 'trending_down';
        }
    };
    GainSeries.prototype.render = function () {
        // TSX doesn't know clipPath attribute
        return React.createElement('g', {
            className: 'gains',
            clipPath: 'url(#' + this.props.clipPath + ')'
        }, this.props.gains.map(this.getGains));
    };
    return GainSeries;
})(React.Component);
var GainSeries;
(function (GainSeries) {
    (function (Direction) {
        Direction[Direction["Up"] = 0] = "Up";
        Direction[Direction["Down"] = 1] = "Down";
    })(GainSeries.Direction || (GainSeries.Direction = {}));
    var Direction = GainSeries.Direction;
})(GainSeries || (GainSeries = {}));
module.exports = GainSeries;
