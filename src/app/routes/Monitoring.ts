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

router.get('/minutes/:dateTime', function(req, res, next) {
	var dateTime = moment(req.params.dateTime);
	if (dateTime.hour() < 6) {
		dateTime.startOf('day');
	} else if (dateTime.hour() >= 18) {
		dateTime.endOf('day');
	} else {
		dateTime.hour(12).startOf('hour');
	}
	
	Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
		{ $match: {
			dateTime: {
				$gt: moment(dateTime).subtract({ hours: 12 }).toDate(),
				$lt: moment(dateTime).add({ hours: 12 }).toDate()
			}
		}},
		{ $sort: { dateTime: 1 }}, // $last needs data to be sorted
		{ $group: {
			_id: {
				year: { $year: '$dateTime' },
				month: { $month: '$dateTime' },
				day: { $dayOfMonth: '$dateTime' },
				hour: { $hour: '$dateTime' },
				minute: { $minute: '$dateTime' }
			},
			d: { $last: '$$ROOT' }
		}},
		{ $sort: { 'd.dateTime': 1 }}, // $group unsorts data so we have to sort again
		{ $project: { // Get back a partial Quote document
			_id: 0,
			dateTime: { $dateToString: {
				format: '%Y-%m-%dT%H:%M:00.000Z',
				date: '$d.dateTime'
			}},
			close: '$d.close'
		}}
	])
	.then(data => res.send(data));
});

export = router;