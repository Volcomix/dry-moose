/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var Divider = require('./Divider');
var ChartRows = (function (_super) {
    __extends(ChartRows, _super);
    function ChartRows() {
        var _this = this;
        _super.apply(this, arguments);
        this.drag = d3.behavior.drag().origin(function (d) { return d; });
        this.onDrag = function (d) {
            var event = d3.event, height = _this.props.height, dividers = _this.props.dividers, min = d.id ? dividers[d.id - 1] : 0, max = (d.id == dividers.length - 1) ? 1 : dividers[d.id + 1];
            dividers[d.id] = Math.min(Math.max(event.y / height, min + 0.1), max - 0.1);
            _this.props.onDividerDrag(dividers);
        };
    }
    ChartRows.prototype.componentDidMount = function () {
        this.drag.on('drag', this.onDrag);
    };
    ChartRows.prototype.componentWillUnmount = function () {
        this.drag.on('drag', null);
    };
    ChartRows.prototype.render = function () {
        var _this = this;
        var margin = this.props.margin;
        return (React.createElement("g", {"transform": 'translate(' + margin.left + ', ' + margin.top + ')'}, this.props.children, this.props.dividers.map(function (ratio, id) {
            return (React.createElement(Divider, {"key": id, "id": id, y: Math.round(_this.props.height * ratio), "width": _this.props.width + _this.props.margin.right, "drag": _this.drag}));
        })));
    };
    return ChartRows;
})(React.Component);
module.exports = ChartRows;
