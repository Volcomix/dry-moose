"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var moment = require('moment');
var MonitoringActions = require('../actions/MonitoringActions');
var Button = require('./Button');
var ChartControls = (function (_super) {
    __extends(ChartControls, _super);
    function ChartControls() {
        var _this = this;
        _super.apply(this, arguments);
        this.goToStart = function () {
            return MonitoringActions.getFirst();
        };
        this.goToEnd = function () {
            return MonitoringActions.getLast();
        };
        this.refresh = function () {
            return MonitoringActions.get(_this.xDomainCenter);
        };
        this.goToPreviousOption = function () {
            return MonitoringActions.getPreviousOption(_this.xDomainCenter);
        };
        this.goToNextOption = function () {
            return MonitoringActions.getNextOption(_this.xDomainCenter);
        };
    }
    Object.defineProperty(ChartControls.prototype, "xDomainCenter", {
        get: function () {
            var domain = this.props.xScale.domain(), start = moment(domain[0]), end = moment(domain[1]), diff = end.diff(start, 'minutes');
            return start.add({ minutes: diff / 2 }).toDate();
        },
        enumerable: true,
        configurable: true
    });
    ChartControls.prototype.render = function () {
        return (React.createElement("div", {className: 'chart-controls'}, React.createElement(Button, {onClick: this.goToStart}, React.createElement("i", {className: 'material-icons'}, "skip_previous")), React.createElement("div", null, React.createElement(Button, {onClick: this.goToPreviousOption}, React.createElement("i", {className: 'material-icons'}, "fast_rewind")), React.createElement(Button, {onClick: this.refresh}, React.createElement("i", {className: 'material-icons'}, "refresh")), React.createElement(Button, {onClick: this.goToNextOption}, React.createElement("i", {className: 'material-icons'}, "fast_forward"))), React.createElement(Button, {onClick: this.goToEnd}, React.createElement("i", {className: 'material-icons'}, "skip_next"))));
    };
    return ChartControls;
}(React.Component));
module.exports = ChartControls;
