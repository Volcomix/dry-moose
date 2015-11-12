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
	
	var startDate = moment(dateTime).subtract({ hours: 12 }).toDate(),
		endDate = moment(dateTime).add({ hours: 11, minutes: 59 }).toDate();
	
	Q.all([
		{ collection: 'quotes', field: 'close' },
		{ collection: 'portfolio', field: 'value'}
	].map((params: Params) =>
		Q.ninvoke(DbManager.db.collection(params.collection), 'aggregate', [
			{ $match: { dateTime: { $gte: startDate, $lte: endDate }}},
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
			{ $sort: { 'd.dateTime': 1 }}, // $group unsorts data so sort again
			{ $project: {
				_id: 0,
				dateTime: { $dateToString: {
					format: '%Y-%m-%dT%H:%M:00.000Z',
					date: '$d.dateTime'
				}},
				[params.field]: '$d.' + params.field
			}}
		])
	))
	.spread((quotes: Quote[], portfolio: Portfolio) => {
		res.send({ startDate, endDate, quotes, portfolio });
	});
});

interface Params {
	collection: string;
	field: string;
}

export = router;