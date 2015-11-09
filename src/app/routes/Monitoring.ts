/// <reference path="../../../typings/tsd.d.ts" />

import express = require('express');
import Q = require('q');
import moment = require('moment');

import DbManager = require('../../database/DbManager');
import Quote = require('../../documents/Quote');
import Portfolio = require('../../documents/Portfolio');

var router = express.Router();

router.get('/', function(req, res, next) {
	Q.all(['quotes', 'portfolio'].map(collection =>
		Q.ninvoke(DbManager.db.collection(collection), 'aggregate', [
			{ $sort: { dateTime: -1 }},
			{ $limit: 1000},
			{ $sort: { dateTime: 1 }}
		])
	))
	.spread((quotes: Quote[], portfolio: Portfolio) => {
		res.send({ quotes, portfolio });
	})
});

router.get('/:dateTime', function(req, res, next) {
	Q.all(['quotes', 'portfolio'].map(collection =>
		Q.ninvoke(DbManager.db.collection(collection).find({
			dateTime: {
				$gt: moment(req.params.dateTime).subtract({ hours: 8 }).toDate(),
				$lt: moment(req.params.dateTime).add({ hours: 8 }).toDate()
			}
		}).sort({ dateTime: 1 }), 'toArray')
	))
	.spread((quotes: Quote[], portfolio: Portfolio) => {
		res.send({ quotes, portfolio });
	});
});

export = router;