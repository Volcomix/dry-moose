/// <reference path="../../../typings/tsd.d.ts" />
var margin = { top: 20, right: 50, bottom: 30, left: 20 }, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
var x = d3.time.scale()
    .range([0, width]);
var y = d3.scale.linear()
    .range([height, 0]);
var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');
var yAxis = d3.svg.axis()
    .scale(y)
    .orient('right');
var line = d3.svg.line()
    .x(function (d) { return x(d.dateTime); })
    .y(function (d) { return y(d.close); });
var svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
d3.json('/monitoring/quotes', function (error, data) {
    if (error)
        throw error;
    data.forEach(function (d) {
        d.dateTime = new Date(d.dateTime);
    });
    x.domain(d3.extent(data, function (d) { return d.dateTime; }));
    y.domain(d3.extent(data, function (d) { return d.close; }));
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(xAxis);
    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + width + ', 0)')
        .call(yAxis);
    svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line);
});
