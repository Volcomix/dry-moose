/// <reference path="../../../typings/tsd.d.ts" />
var Chart = (function () {
    function Chart(margin) {
        if (margin === void 0) { margin = { top: 20, right: 50, bottom: 30, left: 20 }; }
        this.margin = margin;
        this.x = d3.time.scale();
        this.y = d3.scale.linear();
        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .tickFormat(d3.time.format.multi([
            ['.%L', function (d) { return d.getMilliseconds(); }],
            [':%S', function (d) { return d.getSeconds(); }],
            ['%H:%M', function (d) { return d.getMinutes(); }],
            ['%H:%M', function (d) { return d.getHours(); }],
            ['%a %d', function (d) { return d.getDay() && d.getDate() != 1; }],
            ['%b %d', function (d) { return d.getDate() != 1; }],
            ['%B', function (d) { return d.getMonth(); }],
            ['%Y', function () { return true; }]
        ]))
            .orient('bottom');
        this.yAxis = d3.svg.axis()
            .scale(this.y)
            .tickFormat(d3.format(',.5f'))
            .orient('right');
    }
    Chart.prototype.render = function () {
        var _this = this;
        this.svg = d3.select('body').append('svg')
            .append('g');
        this.svg.append('g').attr('class', 'x axis');
        this.svg.append('g').attr('class', 'y axis');
        d3.select(window).on('resize', function () { _this.resize(); });
        this.resize();
    };
    Chart.prototype.draw = function () {
        this.svg.select('g.x.axis').call(this.xAxis);
        this.svg.select('g.y.axis').call(this.yAxis);
    };
    Chart.prototype.resize = function () {
        this.width = parseInt(d3.select('body').style('width')) -
            this.margin.left - this.margin.right;
        this.height = parseInt(d3.select('body').style('height')) -
            this.margin.top - this.margin.bottom;
        this.x.range([0, this.width]);
        this.y.range([this.height, 0]);
        this.xAxis.tickSize(-this.height, 0);
        this.yAxis.tickSize(-this.width, 0);
        d3.select('body svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);
        this.svg.attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')');
        this.svg.select('g.x.axis').attr('transform', 'translate(0, ' + this.height + ')');
        this.svg.select('g.y.axis').attr('transform', 'translate(' + this.width + ', 0)');
        this.draw();
    };
    return Chart;
})();
var chart = new Chart();
chart.render();
