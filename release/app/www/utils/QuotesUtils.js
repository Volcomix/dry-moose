/// <reference path="../../../../typings/tsd.d.ts" />
var Q = require('q');
var d3 = require('d3');
var QuotesServerActions = require('../actions/QuotesServerActions');
function quotify(data) {
    data.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
}
function receiveAndSort(data) {
    quotify(data);
    data.sort(function (a, b) { return +a.dateTime - +b.dateTime; });
    QuotesServerActions.receive(data);
}
function receive(data) {
    quotify(data);
    QuotesServerActions.receive(data);
}
function getLast() {
    Q.nfcall(d3.json, '/monitoring/quotes').then(receiveAndSort);
}
exports.getLast = getLast;
var delay = Q(null);
var retrieveDateTime;
function retrieveData() {
    if (retrieveDateTime) {
        delay = Q.delay(1000).then(retrieveData);
        Q.nfcall(d3.json, '/monitoring/quotes?dateTime=' + retrieveDateTime.toISOString())
            .then(receive);
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
