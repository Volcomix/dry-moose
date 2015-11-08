/// <reference path="../../../../typings/tsd.d.ts" />
var Q = require('q');
var d3 = require('d3');
var QuotesActions = require('../actions/QuotesActions');
function getQuotes() {
    Q.nfcall(d3.json, '/monitoring/quotes')
        .then(function (data) {
        data.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
        data.sort(function (a, b) { return +a.dateTime - +b.dateTime; });
        QuotesActions.receive(data);
    });
}
exports.getQuotes = getQuotes;
