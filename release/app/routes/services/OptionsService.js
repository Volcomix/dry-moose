/// <reference path="../../../../typings/tsd.d.ts" />
var Q = require('q');
var DbManager = require('../../../database/DbManager');
function getFirstDate() {
    return Q.ninvoke(DbManager.db.collection('options'), 'aggregate', [
        { $group: { _id: null, dateTime: { $min: '$quote.dateTime' } } }
    ]);
}
exports.getFirstDate = getFirstDate;
function getLastDate() {
    return Q.ninvoke(DbManager.db.collection('options'), 'aggregate', [
        { $group: { _id: null, dateTime: { $max: '$quote.dateTime' } } }
    ]);
}
exports.getLastDate = getLastDate;
function get(startDate, endDate) {
    return Q.ninvoke(DbManager.db.collection('options'), 'aggregate', [
        { $match: { 'quote.dateTime': { $gte: startDate, $lte: endDate } } },
        { $sort: { 'quote.dateTime': 1 } },
        { $project: {
                _id: 0,
                quote: { dateTime: 1, close: 1 },
                expiration: 1,
                direction: 1
            } }
    ]);
}
exports.get = get;
