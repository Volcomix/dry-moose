/// <reference path="../../../typings/tsd.d.ts" />
var express = require('express');
var Q = require('q');
var moment = require('moment');
var DbManager = require('../../database/DbManager');
var router = express.Router();
router.get('/minutes/first', function (req, res, next) {
    var firstDate;
    Q.all([getFirstQuoteDate(), getFirstPortfolioDate(), getFirstOptionDate()])
        .then(function (results) {
        firstDate = moment.min.apply(moment, results.map(function (result) { return moment(result[0].dateTime); }));
        return getByMinute(firstDate);
    })
        .then(function (data) {
        data.startDate = firstDate.toDate();
        res.send(data);
    });
});
router.get('/minutes/last', function (req, res, next) {
    var lastDate;
    Q.all([getLastQuoteDate(), getLastPortfolioDate(), getLastOptionDate()])
        .then(function (results) {
        lastDate = moment.max.apply(moment, results.map(function (result) { return moment(result[0].dateTime); }));
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
        getQuotes(startDate, endDate),
        getPortfolio(startDate, endDate),
        getOptions(startDate, endDate)
    ])
        .spread(function (quotes, portfolio, options) {
        return ({ startDate: startDate, endDate: endDate, quotes: quotes, portfolio: portfolio, options: options });
    });
}
function getFirstQuoteDate() {
    return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
        { $group: { _id: null, dateTime: { $min: '$dateTime' } } }
    ]);
}
function getFirstPortfolioDate() {
    return Q.ninvoke(DbManager.db.collection('portfolio'), 'aggregate', [
        { $group: { _id: null, dateTime: { $min: '$dateTime' } } }
    ]);
}
function getFirstOptionDate() {
    return Q.ninvoke(DbManager.db.collection('options'), 'aggregate', [
        { $group: { _id: null, dateTime: { $min: '$quote.dateTime' } } }
    ]);
}
function getLastQuoteDate() {
    return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
        { $group: { _id: null, dateTime: { $max: '$dateTime' } } }
    ]);
}
function getLastPortfolioDate() {
    return Q.ninvoke(DbManager.db.collection('portfolio'), 'aggregate', [
        { $group: { _id: null, dateTime: { $max: '$dateTime' } } }
    ]);
}
function getLastOptionDate() {
    return Q.ninvoke(DbManager.db.collection('options'), 'aggregate', [
        { $group: { _id: null, dateTime: { $max: '$quote.dateTime' } } }
    ]);
}
function getQuotes(startDate, endDate) {
    return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
        { $match: { dateTime: { $gte: startDate, $lte: endDate } } },
        { $sort: { dateTime: 1 } },
        { $project: {
                _id: 0,
                dateTime: 1,
                close: 1
            } }
    ]);
}
function getPortfolio(startDate, endDate) {
    return Q.ninvoke(DbManager.db.collection('portfolio'), 'aggregate', [
        { $match: { dateTime: { $gte: startDate, $lte: endDate } } },
        { $sort: { dateTime: 1 } },
        { $project: {
                _id: 0,
                dateTime: 1,
                value: 1
            } }
    ]);
}
function getOptions(startDate, endDate) {
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
module.exports = router;
