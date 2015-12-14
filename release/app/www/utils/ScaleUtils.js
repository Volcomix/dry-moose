/// <reference path="../../../../typings/tsd.d.ts" />
var d3 = require('d3');
function updateYScale(accessors, xScale, yScale, height, yDomainPadding) {
    var extent = accessors.reduce(function (globalExtent, accessor) {
        var bisect = d3.bisector(accessor.x).left, domain = xScale.domain(), i = bisect(accessor.data, domain[0], 1), j = bisect(accessor.data, domain[1], i + 1), domainData = accessor.data.slice(i - 1, j + 1);
        return accessor.y.reduce(function (prevExtent, yAccessor) {
            var extent = d3.extent(domainData, yAccessor);
            return [
                d3.min([prevExtent[0], extent[0]]),
                d3.max([prevExtent[1], extent[1]])
            ];
        }, globalExtent);
    }, [null, null]);
    yScale.range([height, 0]);
    if (extent[0] != extent[1]) {
        var padding = yDomainPadding * (extent[1] - extent[0]);
        yScale.domain([extent[0] - padding, extent[1] + padding]);
    }
}
exports.updateYScale = updateYScale;
