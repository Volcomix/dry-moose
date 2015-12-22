/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');
import d3 = require('d3');
import moment = require('moment');

import Quote = require('../../../documents/Quote');
import MACD = require('../../../documents/MACD');
import MA = require('../../../documents/MovingAverage');
import BBand = require('../../../documents/BBand');
import Portfolio = require('../../../documents/Portfolio');
import Gain = require('../../../documents/Gain');
import MonitoringData = require('../../../documents/MonitoringData');

import MonitoringServerActions = require('../actions/MonitoringServerActions');

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

export function getPreviousOption(dateTime: Date) {
    Q.nfcall(d3.json, '/monitoring/previous/option/' + dateTime.toISOString())
    .then(function(data: MonitoringData) {
        
        var optionReceiver = new OptionReceiver(
            dateTime,
            OptionReceiver.Direction.Previous
        );
        
        restoreDateTimes(data, optionReceiver.gainRestorer);
        
        MonitoringServerActions.receivePreviousOption(
            data,
            optionReceiver.optionDateTime
        );
    });
}

export function getNextOption(dateTime: Date) {
    Q.nfcall(d3.json, '/monitoring/next/option/' + dateTime.toISOString())
    .then(function(data: MonitoringData) {
        
        var optionReceiver = new OptionReceiver(
            dateTime,
            OptionReceiver.Direction.Next
        );
        
        restoreDateTimes(data, optionReceiver.gainRestorer);
        
        MonitoringServerActions.receiveNextOption(
            data,
            optionReceiver.optionDateTime
        );
    });
}

/**
 * Convert all dateTime fields from string to Date. REST services could not
 * send Date objects.
 * @param data - The received data to convert
 * @param gainRestorer - Function to convert Gain data
 */
function restoreDateTimes(data: MonitoringData, gainRestorer?: (d: Gain) => void) {
    data.startDate = new Date(data.startDate as any);
    data.endDate = new Date(data.endDate as any);
	data.quotes.forEach((d: Quote) => d.dateTime = new Date(d.dateTime as any));
    data.macd.forEach((d: MACD) => d.dateTime = new Date(d.dateTime as any));
    data.maCross.fast.forEach((d: MA) => d.dateTime = new Date(d.dateTime as any));
    data.maCross.slow.forEach((d: MA) => d.dateTime = new Date(d.dateTime as any));
    data.maCross.cross.forEach((d: MA) => d.dateTime = new Date(d.dateTime as any));
    data.bband.forEach((d: BBand) => d.dateTime = new Date(d.dateTime as any));
    data.portfolio.forEach((d: Portfolio) => d.dateTime = new Date(d.dateTime as any));
    data.gains.forEach(gainRestorer || restoreGainDateTimes);
}

function restoreGainDateTimes(d: Gain) {
    d.option.quote.dateTime = new Date(d.option.quote.dateTime as any);
    d.option.expiration = new Date(d.option.expiration as any);
    d.quote.dateTime = new Date(d.quote.dateTime as any);
    d.dateTime = new Date(d.dateTime as any);
}

class OptionReceiver {
    
    private dateTime: moment.Moment;
    private _optionDateTime: Date;
    
    get optionDateTime() {
        return this._optionDateTime;
    }
    
    constructor(
        dateTime: Date,
        private direction: OptionReceiver.Direction
    ) {
        this.dateTime = moment(dateTime);
    }
    
    gainRestorer = (d: Gain) => {
        restoreGainDateTimes(d);
        
        switch (this.direction) {
            
            case OptionReceiver.Direction.Previous:
                if (moment(d.option.quote.dateTime).isBefore(this.dateTime)) {
                    this._optionDateTime = d.option.quote.dateTime;
                }
                break;
                
            case OptionReceiver.Direction.Next:
                if (
                    !this._optionDateTime &&
                    moment(d.option.quote.dateTime).isAfter(this.dateTime)
                ) {
                    this._optionDateTime = d.option.quote.dateTime;
                }
                break;
        }
    }
}
module OptionReceiver {
    export enum Direction { Previous, Next }
}