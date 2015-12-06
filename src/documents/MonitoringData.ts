/// <reference path="../../typings/tsd.d.ts" />

import Quote = require('./Quote');
import MACD = require('./MACD');
import Portfolio = require('./Portfolio');
import Gain = require('./Gain');

interface MonitoringData {
    startDate: Date;
    endDate: Date;
    quotes: Quote[];
    macd: MACD[];
    portfolio: Portfolio[];
    gains: Gain[];
}

export = MonitoringData;