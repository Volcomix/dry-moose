"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var YAxis = require('./YAxis');
var ChartRow = (function (_super) {
    __extends(ChartRow, _super);
    function ChartRow() {
        _super.apply(this, arguments);
    }
    ChartRow.prototype.render = function () {
        return (React.createElement("g", {transform: 'translate(0, ' + this.props.y + ')'}, React.createElement("text", {className: 'mdl-typography--title mdl-color-text--grey-700'}, this.props.title), React.createElement('clipPath', { id: this.props.clipPath }, React.createElement("rect", {width: this.props.width, height: this.props.height})) /* TSX doesn't know clipPath element */, this.props.children, React.createElement(YAxis, {width: this.props.width, height: this.props.height, scale: this.props.yScale, zoom: this.props.zoom, clipPath: this.props.clipPath + 'Axis', tickFormat: this.props.yTickFormat})));
    };
    return ChartRow;
}(React.Component));
module.exports = ChartRow;
