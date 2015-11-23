/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');

import MonitoringActions = require('./actions/MonitoringActions');

import Chart = require('./components/Chart');

MonitoringActions.getFirst();

ReactDOM.render(<Chart />, document.getElementById('react'));