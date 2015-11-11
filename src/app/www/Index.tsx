/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');

import MonitoringActions = require('./actions/MonitoringActions');

import Charts = require('./components/Charts');

MonitoringActions.getLast();

ReactDOM.render(<Charts />, document.getElementById('charts'));