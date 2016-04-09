"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var moment = require('moment');
var CursorStore = require('../stores/CursorStore');
var XCursor = (function (_super) {
    __extends(XCursor, _super);
    function XCursor(props) {
        var _this = this;
        _super.call(this, props);
        this.dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
        this.onChange = function () { return _this.setState(_this.xCursorState); };
        this.state = this.xCursorState;
    }
    Object.defineProperty(XCursor.prototype, "xCursorState", {
        get: function () {
            return { mouseX: CursorStore.mouse && CursorStore.mouse[0] };
        },
        enumerable: true,
        configurable: true
    });
    XCursor.prototype.componentDidMount = function () {
        CursorStore.addChangeListener(this.onChange);
    };
    XCursor.prototype.componentWillUnmount = function () {
        CursorStore.removeChangeListener(this.onChange);
    };
    XCursor.prototype.render = function () {
        if (this.state.mouseX) {
            var dateTime = this.snapDateTime();
            return (React.createElement("g", {className: 'x cursor', transform: 'translate(' + this.props.scale(dateTime) + ', 0)'}, React.createElement("line", {y2: this.props.height}), React.createElement("rect", {x: -60, y: this.props.height, width: 120, height: 14}), React.createElement("text", {dy: '.71em', y: this.props.height + 3}, this.dateFormat(dateTime))));
        }
        else {
            return null;
        }
    };
    XCursor.prototype.snapDateTime = function () {
        var domain = this.props.scale.domain(), minDateTime = moment(domain[0]).endOf('minute').add({ second: 1 }), maxDateTime = moment(domain[1]).startOf('minute'), dateTime = moment(this.props.scale.invert(this.state.mouseX));
        // Round to closest minute
        dateTime.add({ seconds: 30 }).startOf('minute');
        return moment.max(moment.min(dateTime, maxDateTime), minDateTime).toDate();
    };
    return XCursor;
}(React.Component));
module.exports = XCursor;
