/// <reference path="../../../../typings/tsd.d.ts" />
var Q = require('q');
var DbManager = require('../../../database/DbManager');
function getPrevious(dateTime) {
    return Q.ninvoke(DbManager.db.collection('options'), 'aggregate', [
        { $match: { 'quote.dateTime': { $lt: dateTime } } },
        { $sort: { 'quote.dateTime': -1 } },
        { $limit: 1 },
        { $project: { _id: 0, dateTime: '$quote.dateTime' } }
    ]);
}
exports.getPrevious = getPrevious;
function getNext(dateTime) {
    return Q.ninvoke(DbManager.db.collection('options'), 'aggregate', [
        { $match: { 'quote.dateTime': { $gt: dateTime } } },
        { $sort: { 'quote.dateTime': 1 } },
        { $limit: 1 },
        { $project: { _id: 0, dateTime: '$quote.dateTime' } }
    ]);
}
exports.getNext = getNext;
