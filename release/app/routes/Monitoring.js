/// <reference path="../../../typings/tsd.d.ts" />
var express = require('express');
var Q = require('q');
var moment = require('moment');
var DbManager = require('../../database/DbManager');
var router = express.Router();
router.get('/minutes/last', function (req, res, next) {
    var lastDate;
    Q.all(['quotes', 'portfolio'].map(function (collection) {
        return Q.ninvoke(DbManager.db.collection(collection), 'aggregate', [
            { $group: { _id: null, endDate: { $max: '$dateTime' } } }
        ]);
    }))
        .spread(function (lastQuote, lastPortfolio) {
        lastDate = moment.max(moment(lastQuote[0].endDate), moment(lastPortfolio[0].endDate));
        return getByMinute(lastDate);
    })
        .then(function (data) {
        data.endDate = lastDate.toDate();
        res.send(data);
    });
});
router.get('/minutes/:dateTime', function (req, res, next) {
    getByMinute(moment(req.params.dateTime)).then(function (data) { return res.send(data); });
});
function getByMinute(dateTime) {
    var roundedDateTime = dateTime.clone(); // Next operations mutates Moment object
    if (roundedDateTime.hour() < 6) {
        roundedDateTime.startOf('day');
    }
    else if (roundedDateTime.hour() >= 18) {
        roundedDateTime.endOf('day');
    }
    else {
        roundedDateTime.hour(12).startOf('hour');
    }
    var startDate = moment(roundedDateTime).subtract({ hours: 12 }).toDate(), endDate = moment(roundedDateTime).add({ hours: 11, minutes: 59 }).toDate();
    return Q.all([
        { collection: 'quotes', field: 'close' },
        { collection: 'portfolio', field: 'value' }
    ].map(function (params) {
        return Q.ninvoke(DbManager.db.collection(params.collection), 'aggregate', [
            { $match: { dateTime: { $gte: startDate, $lte: endDate } } },
            { $sort: { dateTime: 1 } },
            { $project: (_a = {
                        _id: 0,
                        dateTime: 1
                    },
                    _a[params.field] = 1,
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
