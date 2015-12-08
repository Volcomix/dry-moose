/// <reference path="../../../typings/tsd.d.ts" />
var React = require('react');
var ReactDOM = require('react-dom');
var MonitoringActions = require('./actions/MonitoringActions');
var Chart = require('./components/Chart');
var QuotesChart = require('./components/QuotesChart');
var MACDChart = require('./components/MACDChart');
var PortfolioChart = require('./components/PortfolioChart');
MonitoringActions.getFirst();
var chart = React.createElement(Chart, {"charts": [QuotesChart, MACDChart, PortfolioChart]});
ReactDOM.render(chart, document.getElementById('react'));
