/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var moment = require('moment');
var XCursor = (function (_super) {
    __extends(XCursor, _super);
    function XCursor() {
        _super.apply(this, arguments);
        this.dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
    }
    XCursor.prototype.render = function () {
        var dateTime = this.snapDateTime();
        return (React.createElement("g", {"className": 'x cursor', "transform": 'translate(' + this.props.scale(dateTime) + ', 0)'}, React.createElement("line", {"y2": this.props.height}), React.createElement("rect", {x: -60, y: this.props.height, "width": 120, "height": 14}), React.createElement("text", {"dy": '.71em', y: this.props.height + 3}, this.dateFormat(dateTime))));
    };
    XCursor.prototype.snapDateTime = function () {
        var domain = this.props.scale.domain(), minDateTime = moment(domain[0]).endOf('minute').add({ second: 1 }), maxDateTime = moment(domain[1]).startOf('minute'), dateTime = moment(this.props.scale.invert(this.props.mouseX));
        // Round to closest minute
        dateTime.add({ seconds: 30 }).startOf('minute');
        return moment.max(moment.min(dateTime, maxDateTime), minDateTime).toDate();
    };
    return XCursor;
})(React.Component);
var XCursor;
(function (XCursor) {
    XCursor.defaultProps = {
        data: undefined,
        accessor: undefined,
        mouseX: undefined,
        height: undefined,
        scale: undefined,
        snapThreshold: 60000
    };
})(XCursor || (XCursor = {}));
module.exports = XCursor;
