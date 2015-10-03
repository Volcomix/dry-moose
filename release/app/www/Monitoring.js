/// <reference path="../../../typings/tsd.d.ts" />
var margin = { top: 20, right: 50, bottom: 30, left: 20 }, width = 900 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
var x = d3.time.scale()
    .range([0, width]);
var y = d3.scale.linear()
    .range([height, 0]);
var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(d3.time.format.multi([
    [".%L", function (d) { return d.getMilliseconds(); }],
    [":%S", function (d) { return d.getSeconds(); }],
    ["%H:%M", function (d) { return d.getMinutes(); }],
    ["%H:%M", function (d) { return d.getHours(); }],
    ["%a %d", function (d) { return d.getDay() && d.getDate() != 1; }],
    ["%b %d", function (d) { return d.getDate() != 1; }],
    ["%B", function (d) { return d.getMonth(); }],
    ["%Y", function () { return true; }]
]))
    .orient('bottom')
    .tickSize(-height, 0);
var yAxis = d3.svg.axis()
    .scale(y)
    .orient('right')
    .tickSize(-width, 0);
var line = d3.svg.line()
    .x(function (d) { return x(d.dateTime); })
    .y(function (d) { return y(d.close); });
var zoom = d3.behavior.zoom()
    .scaleExtent([1, 50])
    .on('zoom', draw);
var svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
svg.append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('x', x(0))
    .attr('y', y(1))
    .attr('width', x(1) - x(0))
    .attr('height', y(0) - y(1));
svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + height + ')');
svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + width + ', 0)');
svg.append('path')
    .attr('class', 'line')
    .attr('clip-path', 'url(#clip)');
svg.append('rect')
    .attr('class', 'pane')
    .attr('width', width)
    .attr('height', height)
    .call(zoom);
d3.json('/monitoring/quotes', function (error, data) {
    if (error)
        throw error;
    data.forEach(function (d) {
        d.dateTime = new Date(d.dateTime);
    });
    x.domain(d3.extent(data, function (d) { return d.dateTime; }));
    y.domain(d3.extent(data, function (d) { return d.close; })).nice();
    zoom.x(x);
    svg.select('path.line').data([data]);
    draw();
});
function draw() {
    svg.select('g.x.axis').call(xAxis);
    svg.select('g.y.axis').call(yAxis);
    svg.select('path.line').attr('d', line);
}
