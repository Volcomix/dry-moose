"use strict";
var Q = require('q');
var DbManager = require('../../../database/DbManager');
function getFirstDate() {
    return Q.ninvoke(DbManager.db.collection('gains'), 'aggregate', [
        { $group: { _id: null, dateTime: { $min: '$option.quote.dateTime' } } }
    ]);
}
exports.getFirstDate = getFirstDate;
function getLastDate() {
    return Q.ninvoke(DbManager.db.collection('gains'), 'aggregate', [
        { $group: { _id: null, dateTime: { $max: '$dateTime' } } }
    ]);
}
exports.getLastDate = getLastDate;
function get(startDate, endDate) {
    return Q.ninvoke(DbManager.db.collection('gains'), 'aggregate', [
        { $match: { dateTime: { $gte: startDate, $lte: endDate } } },
        { $sort: { dateTime: 1 } },
        { $project: {
                _id: 0,
                option: {
                    quote: { dateTime: 1, close: 1 },
                    expiration: 1,
                    direction: 1
                },
                quote: { dateTime: 1, close: 1 },
                dateTime: 1,
                value: 1
            } }
    ]);
}
exports.get = get;
