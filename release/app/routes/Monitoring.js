/// <reference path="../../../typings/tsd.d.ts" />
var express = require('express');
var Q = require('q');
var moment = require('moment');
var DbManager = require('../../database/DbManager');
var router = express.Router();
router.get('/quotes', function (req, res, next) {
    if (req.query.dateTime) {
        Q.ninvoke(DbManager.db.collection('quotes').find({
            dateTime: {
                $gt: moment(req.query.dateTime).subtract({ hours: 8 }).toDate(),
                $lt: moment(req.query.dateTime).add({ hours: 8 }).toDate()
            }
        }).sort({ dateTime: 1 }), 'toArray')
            .then(function (quotes) { return res.send(quotes); });
    }
    else {
        Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
            { $sort: { dateTime: -1 } },
            { $limit: 1000 },
            { $sort: { dateTime: 1 } }
        ])
            .then(function (quotes) { return res.send(quotes); });
    }
});
module.exports = router;
