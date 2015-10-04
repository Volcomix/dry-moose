/// <reference path="../../../typings/tsd.d.ts" />
var margin = { top: 20, right: 50, bottom: 30, left: 20 }, width = 900 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
var bisectDate = d3.bisector(function (d) { return d.dateTime; }).left, dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
var x = d3.time.scale()
    .range([0, width]);
var y = d3.scale.linear()
    .range([height, 0]);
var xAxis = d3.svg.axis()
    .scale(x)
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
    .orient('bottom')
    .tickSize(-height, 0);
var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(d3.format(',.5f'))
    .orient('right')
    .tickSize(-width, 0);
var line = d3.svg.line()
    .x(function (d) { return x(d.dateTime); })
    .y(function (d) { return y(d.close); });
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
    var zoom = d3.behavior.zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', draw);
    zoom.x(x);
    var scale = zoom.scale();
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + height + ')');
    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + width + ', 0)');
    svg.append('path')
        .attr('class', 'line')
        .attr('clip-path', 'url(#clip)');
    var xTarget = svg.append('g')
        .attr('class', 'x target')
        .style('display', 'none');
    xTarget.append('line')
        .attr('y2', height);
    xTarget.append('rect')
        .attr('x', -60)
        .attr('y', height)
        .attr('width', 120)
        .attr('height', 14);
    xTarget.append('text')
        .attr('y', height + 3)
        .attr('dy', '.71em');
    var yTarget = svg.append('g')
        .attr('class', 'y target')
        .style('display', 'none');
    yTarget.append('line')
        .attr('x2', width);
    yTarget.append('rect')
        .attr('x', width)
        .attr('y', -7)
        .attr('width', 50)
        .attr('height', 14);
    yTarget.append('text')
        .attr('x', width + 3)
        .attr('dy', '.32em');
    svg.append('rect')
        .attr('class', 'pane')
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', function () {
        xTarget.style('display', null);
        yTarget.style('display', null);
    })
        .on('mouseout', function () {
        xTarget.style('display', 'none');
        yTarget.style('display', 'none');
    })
        .on('mousemove', mousemove)
        .call(zoom);
    svg.select('path.line').data([data]);
    draw();
    function mousemove() {
        var mousePos = d3.mouse(this);
        var x0 = x.invert(mousePos[0]), i = bisectDate(data, x0, 1), d0 = data[i - 1], d1 = data[i], d;
        if (d1) {
            d = +x0 - +d0.dateTime > +d1.dateTime - +x0 ? d1 : d0;
        }
        else {
            d = d0;
        }
        xTarget.attr('transform', 'translate(' + x(d.dateTime) + ', 0)');
        xTarget.select('text').text(dateFormat(d.dateTime));
        yTarget.attr('transform', 'translate(0, ' + mousePos[1] + ')');
        yTarget.select('text').text(y.invert(mousePos[1]).toFixed(5));
    }
    function draw() {
        var scaleChanged = (d3.event && scale != d3.event.scale);
        if (scaleChanged) {
            scale = d3.event.scale;
        }
        d3.timer(function () {
            svg.select('g.x.axis').call(xAxis);
            var domain = x.domain(), i = bisectDate(data, domain[0], 1), j = bisectDate(data, domain[1], i + 1);
            y.domain(d3.extent(data.slice(i, j), function (d) {
                return d.close;
            })).nice();
            svg.select('g.y.axis')
                .transition()
                .duration(200)
                .call(yAxis);
            if (scaleChanged) {
                svg.select('path.line')
                    .transition()
                    .duration(200)
                    .attr('d', line);
            }
            else {
                svg.select('path.line').attr('d', line);
            }
            return true;
        });
    }
});
