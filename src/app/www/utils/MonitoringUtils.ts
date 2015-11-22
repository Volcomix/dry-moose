/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');
import Portfolio = require('../../../documents/Portfolio');
import BinaryOption = require('../../../documents/options/BinaryOption');
import MonitoringData = require('../../../documents/MonitoringData');

import MonitoringServerActions = require('../actions/MonitoringServerActions');

/**
 * Convert all dateTime fields from string to Date. REST services could not
 * send Date objects.
 * @param data - The received to data to convert
 */
function restoreDateTimes(data: MonitoringData) {
    data.startDate = new Date(data.startDate as any);
    data.endDate = new Date(data.endDate as any);
	data.quotes.forEach((d: Quote) => d.dateTime = new Date(d.dateTime as any));
    data.portfolio.forEach((d: Portfolio) => d.dateTime = new Date(d.dateTime as any));
    data.options.forEach((d: BinaryOption) => {
        d.quote.dateTime = new Date(d.quote.dateTime as any);
        d.expiration = new Date(d.expiration as any);
    });
}

var delay = Q<void>(null);
var retrieveDateTime: Date;

function retrieveData() {
	if (retrieveDateTime) {
        delay = Q.delay(1000).then(retrieveData);
        
        Q.nfcall(d3.json, '/monitoring/minutes/' + retrieveDateTime.toISOString())
        .then(function(data: MonitoringData) {
            restoreDateTimes(data);
            MonitoringServerActions.receive(data);
        });
        
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
	Q.nfcall(d3.json, '/monitoring/minutes/last')
    .then(function(data: MonitoringData) {
        restoreDateTimes(data);
        MonitoringServerActions.receiveLast(data);
    });
}