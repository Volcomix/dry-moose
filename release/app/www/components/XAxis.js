/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var MonitoringActions = require('../actions/MonitoringActions');
var ZoomActions = require('../actions/ZoomActions');
var XAxis = (function (_super) {
    __extends(XAxis, _super);
    function XAxis(props) {
        var _this = this;
        _super.call(this, props);
        this.zoom = d3.behavior.zoom().scaleExtent([0.5, 10]);
        this.axis = d3.svg.axis()
            .tickFormat(d3.time.format.multi([
            ['.%L', function (d) { return d.getMilliseconds(); }],
            [':%S', function (d) { return d.getSeconds(); }],
            ['%H:%M', function (d) { return d.getMinutes(); }],
            ['%H:%M', function (d) { return d.getHours(); }],
            ['%a %d', function (d) { return d.getDay() && d.getDate() != 1; }],
            ['%b %d', function (d) { return d.getDate() != 1; }],
            ['%B', function (d) { return d.getMonth(); }],
            ['%Y', function (d) { return true; }]
        ]))
            .orient('bottom');
        this.onZoom = function () {
            var domain = _this.props.scale.domain();
            if (domain[0] < _this.props.monitoringData.startDate) {
                MonitoringActions.get(domain[0]);
            }
            else if (domain[1] > _this.props.monitoringData.endDate) {
                MonitoringActions.get(domain[1]);
            }
            setTimeout(ZoomActions.zoom, 0); // Force wait UI refresh
        };
        this.axis.scale(this.props.scale);
    }
    XAxis.prototype.componentDidMount = function () {
        this.zoom.on('zoom', this.onZoom);
        d3.select(this.pane).call(this.zoom);
    };
    XAxis.prototype.componentWillUnmount = function () {
        this.zoom.on('zoom', null);
    };
    XAxis.prototype.render = function () {
        var _this = this;
        // range() wants Dates which is wrong
        this.props.scale.range([0, this.props.width]);
        if (this.props.resetXDomain) {
            this.props.scale.domain(this.props.resetXDomain);
            this.zoom.x(this.props.scale);
        }
        this.axis.tickSize(-this.props.height, 0);
        return (React.createElement("g", null, React.createElement("rect", {"className": 'pane', "ref": function (ref) { return _this.pane = ref; }, "width": this.props.width, "height": this.props.height}), React.createElement("g", {"className": 'x axis', "transform": 'translate(0, ' + this.props.height + ')', "ref": function (ref) { return d3.select(ref).call(_this.axis); }})));
    };
    return XAxis;
})(React.Component);
module.exports = XAxis;
