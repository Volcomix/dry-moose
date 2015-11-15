/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Loading = (function (_super) {
    __extends(Loading, _super);
    function Loading() {
        _super.apply(this, arguments);
    }
    Loading.prototype.componentDidMount = function () {
        componentHandler.upgradeElement(this.loadingElement);
    };
    Loading.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {"className": 'overlay'}, React.createElement("div", {"className": 'mdl-spinner mdl-js-spinner is-active', "ref": function (ref) { return _this.loadingElement = ref; }})));
    };
    return Loading;
})(React.Component);
module.exports = Loading;
