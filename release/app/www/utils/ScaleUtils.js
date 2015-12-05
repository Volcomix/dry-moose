/// <reference path="../../../../typings/tsd.d.ts" />
var d3 = require('d3');
function updateYScale(data, xAccessor, yAccessor, xScale, yScale, height, yDomainPadding) {
    var bisect = d3.bisector(xAccessor).left, domain = xScale.domain(), i = bisect(data, domain[0], 1), j = bisect(data, domain[1], i + 1), domainData = data.slice(i - 1, j + 1), extent = d3.extent(domainData, yAccessor);
    yScale.range([height, 0]);
    if (extent[0] != extent[1]) {
        var padding = yDomainPadding * (extent[1] - extent[0]);
        yScale.domain([extent[0] - padding, extent[1] + padding]);
    }
}
exports.updateYScale = updateYScale;
