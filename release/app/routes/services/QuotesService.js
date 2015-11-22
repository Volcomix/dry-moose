/// <reference path="../../../../typings/tsd.d.ts" />
var Q = require('q');
var DbManager = require('../../../database/DbManager');
function getFirstDate() {
    return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
        { $group: { _id: null, dateTime: { $min: '$dateTime' } } }
    ]);
}
exports.getFirstDate = getFirstDate;
function getLastDate() {
    return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
        { $group: { _id: null, dateTime: { $max: '$dateTime' } } }
    ]);
}
exports.getLastDate = getLastDate;
function get(startDate, endDate) {
    return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
        { $match: { dateTime: { $gte: startDate, $lte: endDate } } },
        { $sort: { dateTime: 1 } },
        { $project: { _id: 0, dateTime: 1, close: 1 } }
    ]);
}
exports.get = get;
