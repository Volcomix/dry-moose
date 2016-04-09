"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        _super.apply(this, arguments);
    }
    Button.prototype.componentDidMount = function () {
        componentHandler.upgradeElement(this.buttonElement);
    };
    Button.prototype.render = function () {
        var _this = this;
        return (React.createElement("button", {className: 'mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab ' +
            'mdl-js-ripple-effect', ref: function (ref) { return _this.buttonElement = ref; }, onClick: this.props.onClick}, this.props.children));
    };
    return Button;
}(React.Component));
module.exports = Button;
