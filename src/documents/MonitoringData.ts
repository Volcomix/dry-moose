/// <reference path="../../typings/tsd.d.ts" />

import Quote = require('./Quote');
import Portfolio = require('./Portfolio');
import Gain = require('./Gain');

interface MonitoringData {
    startDate: Date;
    endDate: Date;
    quotes: Quote[];
    portfolio: Portfolio[];
    gains: Gain[];
}

export = MonitoringData;