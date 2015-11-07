/// <reference path="../../typings/tsd.d.ts" />
var d3 = require('d3');
var Quote;
(function (Quote) {
    Quote.bisect = d3.bisector(function (d) { return d.dateTime; }).left;
})(Quote || (Quote = {}));
module.exports = Quote;
