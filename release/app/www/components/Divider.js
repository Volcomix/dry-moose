/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var Divider = (function (_super) {
    __extends(Divider, _super);
    function Divider() {
        _super.apply(this, arguments);
    }
    Divider.prototype.render = function () {
        var _this = this;
        return (React.createElement("g", {"className": 'divider', "ref": function (ref) { return d3.select(ref)
            .datum({ id: _this.props.id, x: 0, y: _this.props.y })
            .call(_this.props.drag); }, "transform": 'translate(0, ' + this.props.y + ')'}, React.createElement("line", {"x2": this.props.width}), React.createElement("rect", {"transform": 'translate(0, ' + -4 + ')', "width": this.props.width, "height": 7})));
    };
    return Divider;
})(React.Component);
module.exports = Divider;
