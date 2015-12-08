/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');

import MonitoringActions = require('./actions/MonitoringActions');

import Chart = require('./components/Chart');
import QuotesChart = require('./components/QuotesChart');
import MACDChart = require('./components/MACDChart');
import PortfolioChart = require('./components/PortfolioChart');

MonitoringActions.getFirst();

var chart = <Chart charts={[QuotesChart, MACDChart, PortfolioChart]}/>;

ReactDOM.render(chart, document.getElementById('react'));