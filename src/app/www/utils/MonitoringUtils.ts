/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');
import Portfolio = require('../../../documents/Portfolio');

import MonitoringServerActions = require('../actions/MonitoringServerActions');

function receive(data: MonitoringData) {
    // Datetimes are received from server as strings
    data.startDate = new Date(data.startDate as any);
    data.endDate = new Date(data.endDate as any);
	data.quotes.forEach((d: Quote) => d.dateTime = new Date(d.dateTime as any));
    data.portfolio.forEach((d: Portfolio) => d.dateTime = new Date(d.dateTime as any));
    
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

export interface MonitoringData {
    startDate: Date;
    endDate: Date;
    quotes: Quote[];
    portfolio: Portfolio[];
}