/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Axis = (function (_super) {
    __extends(Axis, _super);
    function Axis(props) {
        _super.call(this, props);
        this.axis = d3.svg.axis()
            .scale(this.props.scale)
            .tickFormat(this.props.tickFormat)
            .orient(this.props.orientation);
    }
    Axis.prototype.render = function () {
        var _this = this;
        this.axis.tickSize(this.props.innerTickSize, this.props.outerTickSize);
        return (React.createElement("g", {"className": this.props.className + ' axis', "transform": 'translate(' +
            this.props.translateX + ', ' +
            this.props.translateY +
            ')', "ref": function (ref) { return d3.select(ref).call(_this.axis); }}));
    };
    return Axis;
})(React.Component);
var Axis;
(function (Axis) {
    Axis.defaultProps = {
        innerTickSize: 0,
        outerTickSize: 0,
        translateX: 0,
        translateY: 0
    };
})(Axis || (Axis = {}));
module.exports = Axis;
