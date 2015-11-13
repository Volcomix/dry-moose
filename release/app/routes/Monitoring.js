/// <reference path="../../../typings/tsd.d.ts" />
var express = require('express');
var Q = require('q');
var moment = require('moment');
var DbManager = require('../../database/DbManager');
var router = express.Router();
router.get('/', function (req, res, next) {
    Q.all(['quotes', 'portfolio'].map(function (collection) {
        return Q.ninvoke(DbManager.db.collection(collection), 'aggregate', [
            { $sort: { dateTime: -1 } },
            { $limit: 1000 },
            { $sort: { dateTime: 1 } }
        ]);
    }))
        .spread(function (quotes, portfolio) {
        res.send({ quotes: quotes, portfolio: portfolio });
    });
});
router.get('/:dateTime', function (req, res, next) {
    Q.all(['quotes', 'portfolio'].map(function (collection) {
        return Q.ninvoke(DbManager.db.collection(collection).find({
            dateTime: {
                $gt: moment(req.params.dateTime).subtract({ hours: 8 }).toDate(),
                $lt: moment(req.params.dateTime).add({ hours: 8 }).toDate()
            }
        }).sort({ dateTime: 1 }), 'toArray');
    }))
        .spread(function (quotes, portfolio) {
        res.send({ quotes: quotes, portfolio: portfolio });
    });
});
router.get('/minutes/last', function (req, res, next) {
    Q.all(['quotes', 'portfolio'].map(function (collection) {
        return Q.ninvoke(DbManager.db.collection(collection), 'aggregate', [
            { $group: { _id: null, endDate: { $max: '$dateTime' } } }
        ]);
    }))
        .spread(function (lastQuote, lastPortfolio) {
        return getByMinute(moment.max(moment(lastQuote[0].endDate), moment(lastPortfolio[0].endDate)));
    })
        .then(function (data) { return res.send(data); });
});
router.get('/minutes/:dateTime', function (req, res, next) {
    getByMinute(moment(req.params.dateTime)).then(function (data) { return res.send(data); });
});
/**
 * Get monitoring data grouped by minute, around a given dateTime.
 * The dateTime parameter is mutated by this method to round the dateTime.
 * @param dateTime - The dateTime to get monitoring data
 */
function getByMinute(dateTime) {
    if (dateTime.hour() < 6) {
        dateTime.startOf('day');
    }
    else if (dateTime.hour() >= 18) {
        dateTime.endOf('day');
    }
    else {
        dateTime.hour(12).startOf('hour');
    }
    var startDate = moment(dateTime).subtract({ hours: 12 }).toDate(), endDate = moment(dateTime).add({ hours: 11, minutes: 59 }).toDate();
    return Q.all([
        { collection: 'quotes', field: 'close' },
        { collection: 'portfolio', field: 'value' }
    ].map(function (params) {
        return Q.ninvoke(DbManager.db.collection(params.collection), 'aggregate', [
            { $match: { dateTime: { $gte: startDate, $lte: endDate } } },
            { $sort: { dateTime: 1 } },
            { $group: {
                    _id: {
                        year: { $year: '$dateTime' },
                        month: { $month: '$dateTime' },
                        day: { $dayOfMonth: '$dateTime' },
                        hour: { $hour: '$dateTime' },
                        minute: { $minute: '$dateTime' }
                    },
                    d: { $last: '$$ROOT' }
                } },
            { $sort: { 'd.dateTime': 1 } },
            { $project: (_a = {
                        _id: 0,
                        dateTime: { $dateToString: {
                                format: '%Y-%m-%dT%H:%M:00.000Z',
                                date: '$d.dateTime'
                            } }
                    },
                    _a[params.field] = '$d.' + params.field,
                    _a
                ) }
        ]);
        var _a;
    }))
        .spread(function (quotes, portfolio) {
        return ({ startDate: startDate, endDate: endDate, quotes: quotes, portfolio: portfolio });
    });
}
module.exports = router;
