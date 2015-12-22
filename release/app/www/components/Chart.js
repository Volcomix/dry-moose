/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var MonitoringStore = require('../stores/MonitoringStore');
var MonitoringActions = require('../actions/MonitoringActions');
var XAxis = require('./XAxis');
var Divider = require('./Divider');
var ChartControls = require('./ChartControls');
var Loading = require('./Loading');
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart(props) {
        var _this = this;
        _super.call(this, props);
        this.xScale = d3.time.scale();
        this.drag = d3.behavior.drag().origin(function (d) { return d; });
        this.zoom = d3.behavior.zoom().scaleExtent([0.5, 10]);
        this.onChange = function () { return _this.setState(_this.chartState); };
        this.onDrag = function (d) {
            var event = d3.event, height = _this.contentHeight, dividers = _this.state.dividers, min = d.id ? dividers[d.id - 1] : 0, max = (d.id == dividers.length - 1) ? 1 : dividers[d.id + 1];
            dividers[d.id] = Math.min(Math.max(event.y / height, min + 0.1), max - 0.1);
            _this.setState({ dividers: dividers });
        };
        this.onZoom = function () {
            var domain = _this.xScale.domain();
            if (domain[0] < _this.state.monitoringData.startDate) {
                MonitoringActions.get(domain[0]);
            }
            else if (domain[1] > _this.state.monitoringData.endDate) {
                MonitoringActions.get(domain[1]);
            }
            _this.onChange();
        };
        this.state = this.chartState;
        this.state.dividers = this.getDividers(this.props.charts.length);
    }
    Object.defineProperty(Chart.prototype, "contentWidth", {
        get: function () {
            return this.state.width - Chart.margin.left - Chart.margin.right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "contentHeight", {
        get: function () {
            return this.state.height - Chart.margin.top - Chart.margin.bottom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "chartState", {
        get: function () {
            var rect = this.svg && this.svg.getBoundingClientRect();
            return {
                monitoringData: MonitoringStore.data,
                resetXDomain: MonitoringStore.resetXDomain,
                width: rect ? rect.width : 0,
                height: rect ? rect.height : 0
            };
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.componentDidMount = function () {
        MonitoringStore.addChangeListener(this.onChange);
        window.addEventListener('resize', this.onChange);
        this.drag.on('drag', this.onDrag);
        this.zoom.on('zoom', this.onZoom);
        this.onChange();
    };
    Chart.prototype.componentWillUnmount = function () {
        MonitoringStore.removeChangeListener(this.onChange);
        window.removeEventListener('resize', this.onChange);
        this.drag.on('drag', null);
        this.zoom.on('zoom', null);
    };
    Chart.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.charts.length != this.props.charts.length) {
            this.setState({ dividers: this.getDividers(nextProps.charts.length) });
        }
    };
    Object.defineProperty(Chart.prototype, "chart", {
        get: function () {
            var _this = this;
            if (this.state.monitoringData) {
                var margin = Chart.margin, width = this.contentWidth, height = this.contentHeight, dividersPx = this.state.dividers.map(function (d) { return Math.round(height * d); });
                // range() wants Dates which is wrong
                this.xScale.range([0, width]);
                if (this.state.resetXDomain) {
                    this.xScale.domain(this.state.resetXDomain);
                    this.zoom.x(this.xScale);
                }
                return (React.createElement("g", {"transform": 'translate(' + margin.left + ', ' + margin.top + ')'}, React.createElement(XAxis, {"height": height, "scale": this.xScale}), this.props.charts.map(function (ChartType, id) {
                    var y = id ? dividersPx[id - 1] : 0, rowHeight;
                    if (id == dividersPx.length) {
                        rowHeight = height - y;
                    }
                    else {
                        rowHeight = dividersPx[id] - y;
                    }
                    return (React.createElement(ChartType, {"key": id, "monitoringData": _this.state.monitoringData, y: y, "width": width, "height": rowHeight, "xScale": _this.xScale, "zoom": _this.zoom}));
                }), this.state.dividers.map(function (ratio, id) { return (React.createElement(Divider, {"key": id, "id": id, y: dividersPx[id], "width": width + margin.right, "drag": _this.drag})); })));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "controls", {
        get: function () {
            if (this.state.monitoringData) {
                return React.createElement(ChartControls, {"xScale": this.xScale});
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "loading", {
        get: function () {
            if (!this.state.monitoringData) {
                return React.createElement(Loading, null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {"className": 'chart'}, React.createElement("svg", {"ref": function (ref) { return _this.svg = ref; }}, this.chart), this.controls, this.loading));
    };
    /**
     * Get dividers ratios to separate charts.
     * @param chartsCount - How many charts should be separated
     */
    Chart.prototype.getDividers = function (chartsCount) {
        var dividers = [];
        for (var i = 1; i < chartsCount; i++) {
            dividers.push(i / chartsCount);
        }
        return dividers;
    };
    Chart.margin = { top: 20, right: 50, bottom: 30, left: 20 };
    return Chart;
})(React.Component);
module.exports = Chart;
