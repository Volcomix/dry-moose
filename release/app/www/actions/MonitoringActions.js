/// <reference path="../../../../typings/tsd.d.ts" />
var MonitoringUtils = require('../utils/MonitoringUtils');
function getLast() {
    MonitoringUtils.getLast();
}
exports.getLast = getLast;
function get(dateTime) {
    MonitoringUtils.get(dateTime);
}
exports.get = get;
