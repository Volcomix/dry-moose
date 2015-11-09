/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');

import QuotesServerActions = require('../actions/QuotesServerActions');

function quotify(data: Quote[]) {
	// Datetimes are received from server as strings
	data.forEach(d => d.dateTime = new Date(d.dateTime as any));
}

function receive(data: Quote[]) {
	quotify(data);
	QuotesServerActions.receive(data);
}

function receiveAndSort(data: Quote[]) {
	quotify(data);
	data.sort((a, b) => +a.dateTime - +b.dateTime);
	QuotesServerActions.receive(data);
}

var delay = Q<void>(null);
var retrieveDateTime: Date;

function retrieveData() {
	if (retrieveDateTime) {
        delay = Q.delay(1000).then(retrieveData);
        
        Q.nfcall(d3.json, '/monitoring/quotes?dateTime=' + retrieveDateTime.toISOString())
        .then(receive);
        
        retrieveDateTime = undefined;
    }
}

export function get(dateTime: Date) {
	retrieveDateTime = dateTime;
    
    if (!delay.isPending()) {
        retrieveData();
    }
}

export function getLast() {
	Q.nfcall(d3.json, '/monitoring/quotes').then(receiveAndSort);
}