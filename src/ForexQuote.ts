class ForexQuote {
    
    private _dateTime: Date;
    private _open: number;
    private _high: number;
    private _low: number;
    private _close: number;
    private _volume: number;
    
    constructor(
        dateTime: Date,
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
}

export = ForexQuote;