/// <reference path="../../../typings/tsd.d.ts" />
var React = require('react');
var ReactDOM = require('react-dom');
var MonitoringActions = require('./actions/MonitoringActions');
var Chart = require('./components/Chart');
MonitoringActions.getFirst();
ReactDOM.render(React.createElement(Chart, null), document.getElementById('react'));
