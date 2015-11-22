/// <reference path="../../../../typings/tsd.d.ts" />
var Q = require('q');
var DbManager = require('../../../database/DbManager');
function getFirstQuoteDate() {
    return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
        { $group: { _id: null, dateTime: { $min: '$dateTime' } } }
    ]);
}
exports.getFirstQuoteDate = getFirstQuoteDate;
function getLastQuoteDate() {
    return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
        { $group: { _id: null, dateTime: { $max: '$dateTime' } } }
    ]);
}
exports.getLastQuoteDate = getLastQuoteDate;
