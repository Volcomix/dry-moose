/// <reference path="../../../typings/tsd.d.ts" />

import express = require('express');
import Q = require('q');
import moment = require('moment');

import DbManager = require('../../database/DbManager');
import Quote = require('../../documents/Quote');

var router = express.Router();

router.get('/quotes', function(req, res, next) {
	Q.ninvoke<Quote[]>(DbManager.db.collection('quotes'), 'aggregate', [
		{ $sort: { dateTime: -1 }},
		{ $limit: 1000},
		{ $sort: { dateTime: 1 }}
	])
	.then(quotes => res.send(quotes));
});

router.get('/quotes/:dateTime', function(req, res, next) {
	Q.ninvoke<Quote[]>(DbManager.db.collection('quotes').find({
		dateTime: {
			$gt: moment(req.params.dateTime).subtract({ hours: 8 }).toDate(),
			$lt: moment(req.params.dateTime).add({ hours: 8 }).toDate()
		}
	}).sort({ dateTime: 1 }), 'toArray')
	.then(quotes => res.send(quotes));
});

export = router;