/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');
import MACD = require('../../../documents/MACD');
import Portfolio = require('../../../documents/Portfolio');
import Gain = require('../../../documents/Gain');
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
    data.macd.forEach((d: MACD) => d.dateTime = new Date(d.dateTime as any));
    data.portfolio.forEach((d: Portfolio) => d.dateTime = new Date(d.dateTime as any));
    data.gains.forEach((d: Gain) => {
        d.option.quote.dateTime = new Date(d.option.quote.dateTime as any);
        d.option.expiration = new Date(d.option.expiration as any);
        d.quote.dateTime = new Date(d.quote.dateTime as any);
        d.dateTime = new Date(d.dateTime as any);
    });
}

var delay = Q<void>(null);
var retrieveDateTime: Date;

function retrieveData() {
	if (retrieveDateTime) {
        delay = Q.delay(100).then(retrieveData);
        
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

export function getFirst() {
	Q.nfcall(d3.json, '/monitoring/minutes/first')
    .then(function(data: MonitoringData) {
        restoreDateTimes(data);
        MonitoringServerActions.receiveFirst(data);
    });
}

export function getLast() {
	Q.nfcall(d3.json, '/monitoring/minutes/last')
    .then(function(data: MonitoringData) {
        restoreDateTimes(data);
        MonitoringServerActions.receiveLast(data);
    });
}