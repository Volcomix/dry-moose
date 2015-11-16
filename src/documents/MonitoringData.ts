/// <reference path="../../typings/tsd.d.ts" />

import Quote = require('./Quote');
import Portfolio = require('./Portfolio');
import BinaryOption = require('./options/BinaryOption');

interface MonitoringData {
    startDate: Date;
    endDate: Date;
    quotes: Quote[];
    portfolio: Portfolio[];
    options: BinaryOption[];
}

export = MonitoringData;