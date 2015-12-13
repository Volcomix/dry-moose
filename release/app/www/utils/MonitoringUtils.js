/// <reference path="../../../../typings/tsd.d.ts" />
var Q = require('q');
var d3 = require('d3');
var MonitoringServerActions = require('../actions/MonitoringServerActions');
/**
 * Convert all dateTime fields from string to Date. REST services could not
 * send Date objects.
 * @param data - The received to data to convert
 */
function restoreDateTimes(data) {
    data.startDate = new Date(data.startDate);
    data.endDate = new Date(data.endDate);
    data.quotes.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.macd.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.maCross.fast.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.maCross.slow.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.maCross.cross.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.bband.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.portfolio.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.gains.forEach(function (d) {
        d.option.quote.dateTime = new Date(d.option.quote.dateTime);
        d.option.expiration = new Date(d.option.expiration);
        d.quote.dateTime = new Date(d.quote.dateTime);
        d.dateTime = new Date(d.dateTime);
    });
}
var delay = Q(null);
var retrieveDateTime;
function retrieveData() {
    if (retrieveDateTime) {
        delay = Q.delay(100).then(retrieveData);
        Q.nfcall(d3.json, '/monitoring/minutes/' + retrieveDateTime.toISOString())
            .then(function (data) {
            restoreDateTimes(data);
            MonitoringServerActions.receive(data);
        });
        retrieveDateTime = undefined;
    }
}
function get(dateTime) {
    retrieveDateTime = dateTime;
    if (!delay.isPending()) {
        retrieveData();
    }
}
exports.get = get;
function getFirst() {
    Q.nfcall(d3.json, '/monitoring/minutes/first')
        .then(function (data) {
        restoreDateTimes(data);
        MonitoringServerActions.receiveFirst(data);
    });
}
exports.getFirst = getFirst;
function getLast() {
    Q.nfcall(d3.json, '/monitoring/minutes/last')
        .then(function (data) {
        restoreDateTimes(data);
        MonitoringServerActions.receiveLast(data);
    });
}
exports.getLast = getLast;
