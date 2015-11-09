/// <reference path="../../../typings/tsd.d.ts" />

import express = require('express');
import Q = require('q');
import moment = require('moment');

import DbManager = require('../../database/DbManager');
import Quote = require('../../documents/Quote');

var router = express.Router();

router.get('/quotes', function(req, res, next) {
	if (req.query.dateTime) {
		Q.ninvoke<Quote[]>(DbManager.db.collection('quotes').find({
			dateTime: {
				$gt: moment(req.query.dateTime).subtract({ hours: 8 }).toDate(),
				$lt: moment(req.query.dateTime).add({ hours: 8 }).toDate()
			}
		}).sort({ dateTime: 1 }), 'toArray')
		.then(quotes => res.send(quotes));
	} else {
		Q.ninvoke<Quote[]>(DbManager.db.collection('quotes'), 'aggregate', [
			{ $sort: { dateTime: -1 }},
			{ $limit: 1000},
			{ $sort: { dateTime: 1 }}
		])
		.then(quotes => res.send(quotes));
	}
});

export = router;