/// <reference path="../../../typings/tsd.d.ts" />
var React = require('react');
var ReactDOM = require('react-dom');
var Chart = require('./components/Chart');
var asQuote = function (dateTime, close) { return ({
    dateTime: dateTime,
    open: undefined,
    high: undefined,
    low: undefined,
    close: close,
    volume: undefined,
    rewards: undefined
}); };
var data = [
    asQuote(new Date('2015-10-20T10:00:00Z'), 1.12),
    asQuote(new Date('2015-10-20T11:00:00Z'), 1.20),
    asQuote(new Date('2015-10-20T12:00:00Z'), 1.16),
    asQuote(new Date('2015-10-20T13:00:00Z'), 1.35)
];
ReactDOM.render(React.createElement(Chart, {"data": data}), document.getElementById('chart'));
