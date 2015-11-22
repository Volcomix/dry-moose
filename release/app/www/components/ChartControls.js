/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var MonitoringActions = require('../actions/MonitoringActions');
var Button = require('./Button');
var ChartControls = (function (_super) {
    __extends(ChartControls, _super);
    function ChartControls() {
        _super.apply(this, arguments);
    }
    ChartControls.prototype.render = function () {
        return (React.createElement("div", {"className": 'chart-controls'}, React.createElement(Button, {"onClick": this.goToEnd}, React.createElement("i", {"className": "material-icons"}, "skip_next"))));
    };
    ChartControls.prototype.goToEnd = function () {
        MonitoringActions.getLast();
    };
    return ChartControls;
})(React.Component);
module.exports = ChartControls;
