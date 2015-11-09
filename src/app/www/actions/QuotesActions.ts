/// <reference path="../../../../typings/tsd.d.ts" />

import QuotesUtils = require('../utils/QuotesUtils');

export function getLast() {
	QuotesUtils.getLast();
}

export function get(dateTime: Date) {
	QuotesUtils.get(dateTime);
}