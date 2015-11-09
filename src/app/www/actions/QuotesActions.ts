/// <reference path="../../../../typings/tsd.d.ts" />

import MonitoringUtils = require('../utils/MonitoringUtils');

export function getLast() {
	MonitoringUtils.getLast();
}

export function get(dateTime: Date) {
	MonitoringUtils.get(dateTime);
}