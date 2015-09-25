/// <reference path="../../typings/tsd.d.ts" />

interface Quote {
    dateTime: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export = Quote;