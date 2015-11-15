/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Title = (function (_super) {
    __extends(Title, _super);
    function Title() {
        _super.apply(this, arguments);
    }
    Title.prototype.render = function () {
        return (React.createElement("div", {"className": 'mdl-typography--title mdl-color-text--grey-700'}, this.props.children));
    };
    return Title;
})(React.Component);
module.exports = Title;
