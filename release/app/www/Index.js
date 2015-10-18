/// <reference path="../../../typings/tsd.d.ts" />
var React = require('react');
var ReactDOM = require('react-dom');
var Chart = require('./Chart');
ReactDOM.render(React.createElement(Chart, {"width": 800, "height": 600}), document.getElementById('chart'));
