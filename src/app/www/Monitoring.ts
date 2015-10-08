/// <reference path="../../../typings/tsd.d.ts" />

import Quote = require('../../documents/Quote');

var margin = { top: 20, right: 50, bottom: 30, left: 20 },
    shouldInit: boolean = true,
    width: number, height: number;

var bisectDate = d3.bisector(function(d: Quote) { return d.dateTime; }).left,
    dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');

var x = d3.time.scale();
var y = d3.scale.linear();

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(d3.time.format.multi([
        ['.%L', function(d) { return d.getMilliseconds(); }],
        [':%S', function(d) { return d.getSeconds(); }],
        ['%H:%M', function(d) { return d.getMinutes(); }],
        ['%H:%M', function(d) { return d.getHours(); }],
        ['%a %d', function(d) { return d.getDay() && d.getDate() != 1; }],
        ['%b %d', function(d) { return d.getDate() != 1; }],
        ['%B', function(d) { return d.getMonth(); }],
        ['%Y', function() { return true; }]
    ]))
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(d3.format(',.5f'))
    .orient('right');

var line = d3.svg.line()
    .x(<any>function(d: Quote) { return x(d.dateTime); })
    .y(<any>function(d: Quote) { return y(d.close); });

var zoom = d3.behavior.zoom()
    .scaleExtent([0.5, 10]);

var svg = d3.select('body').append('svg')
    .append('g');

svg.append('clipPath').attr('id', 'clip')
    .append('rect');
    
svg.append('g').attr('class', 'x axis');
svg.append('g').attr('class', 'y axis');

svg.append('path')
    .attr('class', 'line')
    .attr('clip-path', 'url(#clip)');

var xTarget = svg.append('g')
    .attr('class', 'x target')
    .attr('transform', 'translate(-9999, 0)');

xTarget.append('line');

xTarget.append('rect')
    .attr('x', -60)
    .attr('width', 120)
    .attr('height', 14);

xTarget.append('text')
    .attr('dy', '.71em');

var yTarget = svg.append('g')
    .attr('class', 'y target')
    .attr('transform', 'translate(0, -9999)');

yTarget.append('line');

yTarget.append('rect')
    .attr('y', -7)
    .attr('width', 50)
    .attr('height', 14);

yTarget.append('text')
    .attr('dy', '.32em');

svg.append('rect')
    .attr('class', 'pane')
    .call(zoom);

Q.nfcall(d3.json, '/monitoring/quotes').then(loadData);

function loadData(data: Quote[]) {
    if (!data.length) return;
    
    data.forEach(function(d) {
        d.dateTime = new Date(<any>d.dateTime);
    });
    
    data.sort(function(a, b) {
        return +a.dateTime - +b.dateTime;
    });
    
    if (+x.domain()[0] == 0 && +x.domain()[1] == 1) {
        var lastQuote = data[data.length - 1];
        x.domain([
            moment(lastQuote.dateTime).subtract({hours: 2}).toDate(),
            lastQuote.dateTime
        ]).nice();
        
        y.domain(d3.extent(data, function(d: Quote) {
            return d.close;
        })).nice();
    }
    
    zoom.on('zoom', draw);
    svg.select('rect.pane')
        .on('mouseover', function() {
            xTarget.style('display', null);
            yTarget.style('display', null);
        })
        .on('mouseout', function() {
            xTarget.style('display', 'none');
            yTarget.style('display', 'none');
        })
        .on('mousemove', mousemove);
    svg.select('path.line').data([data]);
    
    d3.select(window).on('resize', resize);
    
    if (shouldInit) {
        shouldInit = false;
        resize();
    } else {
        draw();
    }
    
    var scale = zoom.scale();

    function mousemove() {
        var mousePos = d3.mouse(this);
        
        var x0 = x.invert(mousePos[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d;
            
            if (d1) {
                d = +x0 - +d0.dateTime > +d1.dateTime - +x0 ? d1 : d0;
            } else {
                d = d0;
            }
        
        xTarget.attr('transform', 'translate(' + x(d.dateTime) + ', 0)');
        xTarget.select('text').text(dateFormat(d.dateTime));
        
        yTarget.attr('transform', 'translate(0, ' + mousePos[1] + ')');
        yTarget.select('text').text(y.invert(mousePos[1]).toFixed(5));
    }

    function draw() {
        var scaleChanged = (
            d3.event && scale != (<d3.ZoomEvent>d3.event).scale
        );
        if (scaleChanged) {
            scale = (<d3.ZoomEvent>d3.event).scale;
        }
        
        var zoomed = !!d3.event;
        var resized = d3.event && d3.event.type == 'resize';
        
        d3.timer(function() { // Force to not block browser
            var domain = x.domain();
            
            if (zoomed) {
                if (domain[0] < data[0].dateTime) {
                    updateData(domain[0]);
                } else if (domain[1] > data[data.length - 1].dateTime) {
                    updateData(domain[1]);
                }
            }
            
            var i = bisectDate(data, domain[0], 1),
                j = bisectDate(data, domain[1], i + 1);
            
            var extent = d3.extent(data.slice(i, j + 1), function(d: Quote) {
                return d.close;
            });
            if (extent[0] && extent[1]) {
                y.domain(extent).nice();
            }
            
            svg.select('g.x.axis').call(xAxis);
            
            if (resized) {
                svg.select('g.y.axis').call(yAxis);
            } else {
                svg.select('g.y.axis')
                    .transition()
                    .duration(200)
                    .call(yAxis);
            }
            
            if (scaleChanged) {
                svg.select('path.line')
                    .transition()
                    .duration(200)
                    .attr('d', line);
            } else {
                svg.select('path.line').attr('d', line);
            }
            
            return true;
        });
    }
    
    function resize() {
        width = parseInt(d3.select('body').style('width')) -
                margin.left - margin.right;
        height = parseInt(d3.select('body').style('height')) -
                margin.top - margin.bottom;
                
        x.range([0, width]);
        y.range([height, 0]);
        
        xAxis.tickSize(-height, 0);
        yAxis.tickSize(-width, 0);
                
        d3.select('body svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);
        svg.attr('transform',
            'translate(' + margin.left + ', ' + margin.top + ')'
        );
        
        svg.select('clipPath rect')
            .attr('width', width)
            .attr('height', height);
        
        svg.select('g.x.axis').attr('transform', 'translate(0, ' + height + ')');
        svg.select('g.y.axis').attr('transform', 'translate(' + width + ', 0)');
    
        if (!zoom.x()) {
            zoom.x(<any>x);
        }
        
        xTarget.select('line').attr('y2', height);
        xTarget.select('rect').attr('y', height);
        xTarget.select('text').attr('y', height + 3);
        
        yTarget.select('line').attr('x2', width);
        yTarget.select('rect').attr('x', width);
        yTarget.select('text').attr('x', width + 3);
        
        svg.select('rect.pane')
            .attr('width', width)
            .attr('height', height);
        
        draw();
    }
}

var delay = Q<void>(null);
var retrieveDateTime: Date;

function updateData(dateTime: Date) {
    retrieveDateTime = dateTime;
    
    if (!delay.isPending()) {
        retrieveData();
    }
}

function retrieveData() {
    if (retrieveDateTime) {
        delay = Q.delay(1000).then(retrieveData);
        
        Q.nfcall(d3.json,
            '/monitoring/quotes?dateTime=' + retrieveDateTime.toISOString()
        )
        .then(function(data: Quote[]) {
            loadData(data);
        });
        
        retrieveDateTime = undefined;
    }
}