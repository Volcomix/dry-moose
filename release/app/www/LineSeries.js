/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var LineSeries = (function (_super) {
    __extends(LineSeries, _super);
    function LineSeries() {
        _super.apply(this, arguments);
    }
    LineSeries.prototype.render = function () {
        return React.createElement("path", {"className": 'line'});
    };
    return LineSeries;
})(React.Component);
module.exports = LineSeries;
