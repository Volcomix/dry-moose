/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var BinaryOption = require('../../../documents/options/BinaryOption');
var ChartConstants = require('../constants/ChartConstants');
var OptionSeries = (function (_super) {
    __extends(OptionSeries, _super);
    function OptionSeries() {
        var _this = this;
        _super.apply(this, arguments);
        this.getOptions = function (option) {
            var direction, x1 = _this.props.xScale(option.quote.dateTime), x2 = _this.props.xScale(option.expiration), y = _this.props.yScale(option.quote.close);
            return (React.createElement("g", {"key": +option.quote.dateTime, "transform": 'translate(' + x1 + ', ' + y + ')'}, React.createElement("text", {"className": 'material-icons'}, _this.getDirectionIcon(option)), React.createElement("circle", {r: 4.5}), React.createElement("line", {"x2": x2 - x1})));
        };
    }
    OptionSeries.prototype.getDirectionIcon = function (option) {
        switch (option.direction) {
            case BinaryOption.Direction.Call:
                return 'trending_up';
            case BinaryOption.Direction.Put:
                return 'trending_down';
        }
    };
    OptionSeries.prototype.render = function () {
        // TSX doesn't know clipPath attribute
        return React.createElement('g', {
            className: 'options',
            clipPath: 'url(#' + ChartConstants.clipPath + ')'
        }, this.props.options.map(this.getOptions));
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
