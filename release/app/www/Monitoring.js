/// <reference path="../../../typings/tsd.d.ts" />
var body = d3.select("body");
d3.json('/monitoring/quotes', function (err, data) {
    data.forEach(function (d) {
        d.dateTime = new Date(d.dateTime);
    });
    var x = d3.time.scale().range([0, 800]), y = d3.scale.linear().range([600, 0]);
    x.domain([data[0].dateTime, data[data.length - 1].dateTime]);
    y.domain(d3.extent(data, function (d) { return d.close; }));
    var line = d3.svg.line()
        .x(function (d) { return x(d.dateTime); })
        .y(function (d) { return y(d.close); })
        .interpolate("basis");
    d3.select('svg')
        .datum(data)
        .append('path')
        .attr("d", line);
});
