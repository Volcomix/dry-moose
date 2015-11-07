/// <reference path="../../typings/tsd.d.ts" />

import d3 = require('d3');

import Reward = require('./Reward');

interface Quote {
    dateTime: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    rewards: Reward[];
}

module Quote {
    export var bisect = d3.bisector<Quote, Date>(d => d.dateTime).left;
}

export = Quote;