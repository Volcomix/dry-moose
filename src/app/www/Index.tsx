/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');

import MonitoringActions = require('./actions/MonitoringActions');

import Chart = require('./components/Chart');
import QuotesChart = require('./components/QuotesChart');
import MACDChart = require('./components/MACDChart');
import MACrossChart = require('./components/MACrossChart');
import BBWChart = require('./components/BBWChart');
import PortfolioChart = require('./components/PortfolioChart');

MonitoringActions.getFirst();

ReactDOM.render((
	<Chart charts={[ QuotesChart, MACDChart, MACrossChart, BBWChart, PortfolioChart ]}/>
), document.getElementById('react'));