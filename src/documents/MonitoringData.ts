/// <reference path="../../typings/tsd.d.ts" />

import Quote = require('./Quote');
import MACD = require('./MACD');
import MACross = require('./MACross');
import Portfolio = require('./Portfolio');
import Gain = require('./Gain');

interface MonitoringData {
    startDate: Date;
    endDate: Date;
    quotes: Quote[];
    macd: MACD[];
    maCross: MACross;
    portfolio: Portfolio[];
    gains: Gain[];
}

export = MonitoringData;