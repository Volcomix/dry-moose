/// <reference path="../../../typings/tsd.d.ts" />
var express = require('express');
var Q = require('q');
var moment = require('moment');
var DbManager = require('../../database/DbManager');
var router = express.Router();
router.get('/quotes', function (req, res, next) {
    var cursor;
    if (req.query.dateTime) {
        cursor = DbManager.db.collection('quotes')
            .find({ dateTime: {
                $gt: moment(req.query.dateTime).subtract({ hours: 8 }).toDate(),
                $lt: moment(req.query.dateTime).add({ hours: 8 }).toDate()
            } });
    }
    else {
        cursor = DbManager.db.collection('quotes')
            .find()
            .sort({ dateTime: -1 })
            .limit(1000);
    }
    Q.ninvoke(cursor, 'toArray')
        .then(function (quotes) {
        res.send(quotes);
    });
});
module.exports = router;
