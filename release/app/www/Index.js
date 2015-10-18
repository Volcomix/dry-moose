/// <reference path="../../../typings/tsd.d.ts" />
var React = require('react');
var ReactDOM = require('react-dom');
var Chart = require('./Chart');
var Resizer = require('./Resizer');
ReactDOM.render(React.createElement(Resizer, null, React.createElement(Chart, null)), document.getElementById('chart'));
