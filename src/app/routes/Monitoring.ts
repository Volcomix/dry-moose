/// <reference path="../../../typings/tsd.d.ts" />

import express = require('express');
import Q = require('q');
import moment = require('moment');

import DbManager = require('../../database/DbManager');
import Quote = require('../../documents/Quote');
import Portfolio = require('../../documents/Portfolio');
import MonitoringData = require('../../documents/MonitoringData');

var router = express.Router();

router.get('/minutes/last', function(req, res, next) {
	Q.all(['quotes', 'portfolio'].map(collection =>
		Q.ninvoke(DbManager.db.collection(collection), 'aggregate', [
			{ $group: { _id: null, endDate: { $max: '$dateTime' }}}
		])
	))
	.spread((lastQuote: [{ endDate: Date }], lastPortfolio: [{ endDate: Date }]) =>
		getByMinute(moment.max(
			moment(lastQuote[0].endDate),
			moment(lastPortfolio[0].endDate)
		))
	)
	.then(data => res.send(data));
});

router.get('/minutes/:dateTime', function(req, res, next) {
	getByMinute(moment(req.params.dateTime)).then(data => res.send(data));
});

/**
 * Get monitoring data by minute, around a given dateTime.
 * The dateTime parameter is mutated by this method to round the dateTime.
 * @param dateTime - The dateTime to get monitoring data
 */
function getByMinute(dateTime: moment.Moment): Q.Promise<MonitoringData> {
	if (dateTime.hour() < 6) {
		dateTime.startOf('day');
	} else if (dateTime.hour() >= 18) {
		dateTime.endOf('day');
	} else {
		dateTime.hour(12).startOf('hour');
	}
	
	var startDate = moment(dateTime).subtract({ hours: 12 }).toDate(),
		endDate = moment(dateTime).add({ hours: 11, minutes: 59 }).toDate();
	
	return Q.all([
		{ collection: 'quotes', field: 'close' },
		{ collection: 'portfolio', field: 'value'}
	].map((params: Params) =>
		Q.ninvoke(DbManager.db.collection(params.collection), 'aggregate', [
			{ $match: { dateTime: { $gte: startDate, $lte: endDate }}},
			{ $sort: { dateTime: 1 }},
			{ $project: {
				_id: 0,
				dateTime: 1,
				[params.field]: 1
			}}
		])
	))
	.spread<MonitoringData>((quotes: Quote[], portfolio: Portfolio[]) =>
		({ startDate, endDate, quotes, portfolio })
	);
}

interface Params {
	collection: string;
	field: string;
}

export = router;