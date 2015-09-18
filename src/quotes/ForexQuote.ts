/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

class ForexQuote {
    
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
    
    get dateTime(): moment.Moment {
        return this._dateTime;
    }
    
    get open(): number {
        return this._open;
    }
    
    get high(): number {
        return this._high;
    }
    
    get low(): number {
        return this._low;
    }
    
    get close(): number {
        return this._close;
    }
    
    get volume() {
        return this._volume;
    }
}

export = ForexQuote;