/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDOM = require('react-dom');
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart() {
        _super.apply(this, arguments);
    }
    Chart.prototype.render = function () {
        return React.createElement("div", null, "Hello ", this.props.name);
    };
    return Chart;
})(React.Component);
var x = React.createElement(Chart, {"name": "World"});
ReactDOM.render(x, document.getElementById('example'));
