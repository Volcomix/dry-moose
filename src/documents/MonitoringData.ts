/// <reference path="../../typings/tsd.d.ts" />

import Quote = require('./Quote');
import Portfolio = require('./Portfolio');

interface MonitoringData {
    startDate: Date;
    endDate: Date;
    quotes: Quote[];
    portfolio: Portfolio[];
}

export = MonitoringData;