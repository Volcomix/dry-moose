/// <reference path="../../../typings/tsd.d.ts" />

var body = d3.select("body");

body
.transition()
.style("background-color", "lightgrey");

body
.append("div")
.html("Hello, world!");