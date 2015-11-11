/// <reference path="../../../typings/tsd.d.ts" />
var React = require('react');
var ReactDOM = require('react-dom');
var MonitoringActions = require('./actions/MonitoringActions');
var Charts = require('./components/Charts');
MonitoringActions.getLast();
ReactDOM.render(React.createElement(Charts, null), document.getElementById('charts'));
