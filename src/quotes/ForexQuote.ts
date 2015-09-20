/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import IQuote = require('./IQuote');

class ForexQuote implements IQuote {
    
    private _dateTime: moment.Moment;
    private _open: number;
    private _high: number;
    private _low: number;
    private _close: number;
    private _volume: number;
    
    constructor(
        dateTime: moment.Moment,
        open: number,
        high: number,
        low: number,
        close: number,
        volume: number
    ) {
        this._dateTime = dateTime;
        this._open = open;
        this._high = high;
        this._low = low;
        this._close = close;
        this._volume = volume;
    }
    
    get dateTime() {
        return this._dateTime;
    }
    
    get open() {
        return this._open;
    }
    
    get high() {
        return this._high;
    }
    
    get low() {
        return this._low;
    }
    
    get close() {
        return this._close;
    }
    
    get volume() {
        return this._volume;
    }
    
    toDocument() {
        return {
            dateTime: this.dateTime.toDate(),
            open: this.open,
            high: this.high,
            low: this.low,
            close: this.close,
            volume: this.volume
        }
    }
}

export = ForexQuote;