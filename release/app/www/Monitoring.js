/// <reference path="../../../typings/tsd.d.ts" />
var margin = { top: 20, right: 50, bottom: 30, left: 20 }, width = 900 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
var bisectDate = d3.bisector(function (d) { return d.dateTime; }).left;
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
    .scaleExtent([0.1, 10])
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
d3.json('/monitoring/quotes', function (error, data) {
    if (error)
        throw error;
    data.forEach(function (d) {
        d.dateTime = new Date(d.dateTime);
    });
    data.sort(function (a, b) {
        return +a.dateTime - +b.dateTime;
    });
    if (data.length) {
        var lastQuote = data[data.length - 1];
        x.domain([
            moment(lastQuote.dateTime).subtract({ hours: 2 }).toDate(),
            lastQuote.dateTime
        ]).nice();
    }
    y.domain(d3.extent(data, function (d) { return d.close; })).nice();
    zoom.x(x);
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + height + ')');
    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + width + ', 0)');
    svg.append('path')
        .attr('class', 'line')
        .attr('clip-path', 'url(#clip)');
    var target = svg.append('g')
        .attr('class', 'target');
    var targetX = target.append('line')
        .attr('y1', 0)
        .attr('y2', height);
    var targetY = target.append('line')
        .attr('x1', 0)
        .attr('x2', width);
    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");
    focus.append("circle")
        .attr("r", 4.5);
    focus.append("rect")
        .attr("x", 9)
        .attr("y", -8)
        .attr("width", 50)
        .attr("height", 16);
    focus.append("text")
        .attr("x", 14)
        .attr("dy", ".35em");
    svg.append('rect')
        .attr('class', 'pane')
        .attr('width', width)
        .attr('height', height)
        .on("mouseover", function () {
        focus.style("display", null);
        target.style('display', null);
    })
        .on("mouseout", function () {
        focus.style("display", "none");
        target.style('display', "none");
    })
        .on("mousemove", mousemove)
        .call(zoom);
    svg.select('path.line').data([data]);
    draw();
    function mousemove() {
        var mousePos = d3.mouse(this);
        var x0 = x.invert(mousePos[0]), i = bisectDate(data, x0, 1), d0 = data[i - 1], d1 = data[i], d = +x0 - +d0.dateTime > +d1.dateTime - +x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.dateTime) + "," + y(d.close) + ")");
        focus.select("text").text(d.close);
        targetX.attr('x1', mousePos[0]).attr('x2', mousePos[0]);
        targetY.attr('y1', mousePos[1]).attr('y2', mousePos[1]);
    }
});
function draw() {
    svg.select('g.x.axis').call(xAxis);
    svg.select('g.y.axis').call(yAxis);
    svg.select('path.line').attr('d', line);
}
