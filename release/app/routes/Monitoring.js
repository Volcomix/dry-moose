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
module.exports = router;
