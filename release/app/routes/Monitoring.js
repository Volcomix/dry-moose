/// <reference path="../../../typings/tsd.d.ts" />
var express = require('express');
var Q = require('q');
var DbManager = require('../../database/DbManager');
var router = express.Router();
router.get('/quotes', function (req, res, next) {
    var cursor = DbManager.db.collection('quotes').find().sort({ dateTime: 1 }).limit(1000);
    Q.ninvoke(cursor, 'toArray')
        .then(function (quotes) {
        res.send(quotes);
    });
});
module.exports = router;
