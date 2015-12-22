/// <reference path="../../../../typings/tsd.d.ts" />

import MonitoringUtils = require('../utils/MonitoringUtils');

export function getFirst() {
	MonitoringUtils.getFirst();
}

export function getLast() {
	MonitoringUtils.getLast();
}

export function get(dateTime: Date) {
	MonitoringUtils.get(dateTime);
}

export function getPreviousOption(dateTime: Date) {
    MonitoringUtils.getPreviousOption(dateTime);
}

export function getNextOption(dateTime: Date) {
    MonitoringUtils.getNextOption(dateTime);
}