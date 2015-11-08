/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');

import QuotesActions = require('../actions/QuotesActions');

export function getQuotes() {
	Q.nfcall(d3.json, '/monitoring/quotes')
	.then(function(data: Quote[]) {
		data.forEach(d => d.dateTime = new Date(d.dateTime as any));
		data.sort((a, b) => +a.dateTime - +b.dateTime);
		QuotesActions.receive(data);
	});
}