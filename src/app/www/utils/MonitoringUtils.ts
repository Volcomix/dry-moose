/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');
import Portfolio = require('../../../documents/Portfolio');

import MonitoringServerActions = require('../actions/MonitoringServerActions');

function convertDateTime(d: { dateTime: Date }) {
    d.dateTime = new Date(d.dateTime as any);
}

function receive(data: { quotes: Quote[], portfolio: Portfolio[]}) {
    // Datetimes are received from server as strings
	data.quotes.forEach(convertDateTime);
    data.portfolio.forEach(convertDateTime);
    
	MonitoringServerActions.receive(data);
}

var delay = Q<void>(null);
var retrieveDateTime: Date;

function retrieveData() {
	if (retrieveDateTime) {
        delay = Q.delay(1000).then(retrieveData);
        
        Q.nfcall(d3.json, '/monitoring/' + retrieveDateTime.toISOString())
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
	Q.nfcall(d3.json, '/monitoring').then(receive);
}