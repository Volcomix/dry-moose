/// <reference path="../../../typings/tsd.d.ts" />

import express = require('express');
import Q = require('q');
import moment = require('moment');

import DbManager = require('../../database/DbManager');
import Quote = require('../../documents/Quote');
import Portfolio = require('../../documents/Portfolio');
import BinaryOption = require('../../documents/options/BinaryOption');
import MonitoringData = require('../../documents/MonitoringData');

var router = express.Router();

router.get('/minutes/first', function(req, res, next) {
	var firstDate: moment.Moment;
	Q.all([getFirstQuoteDate(), getFirstPortfolioDate(), getFirstOptionDate()])
	.then((results) => {
		firstDate = moment.min(...results.map(result => moment(result[0].dateTime)));
		return getByMinute(firstDate);
	})
	.then(data => {
		data.startDate = firstDate.toDate();
		res.send(data)
	});
});

router.get('/minutes/last', function(req, res, next) {
	var lastDate: moment.Moment;
	Q.all([getLastQuoteDate(), getLastPortfolioDate(), getLastOptionDate()])
	.then((results) => {
		lastDate = moment.max(...results.map(result => moment(result[0].dateTime)));
		return getByMinute(lastDate);
	})
	.then(data => {
		data.endDate = lastDate.toDate();
		res.send(data)
	});
});

router.get('/minutes/:dateTime', function(req, res, next) {
	getByMinute(moment(req.params.dateTime)).then(data => res.send(data));
});

function getByMinute(dateTime: moment.Moment): Q.Promise<MonitoringData> {
	var roundedDateTime = dateTime.clone(); // Next operations mutates Moment object
	if (roundedDateTime.hour() < 6) {
		roundedDateTime.startOf('day');
	} else if (roundedDateTime.hour() >= 18) {
		roundedDateTime.endOf('day');
	} else {
		roundedDateTime.hour(12).startOf('hour');
	}
	
	var startDate = moment(roundedDateTime).subtract({ hours: 12 }).toDate(),
		endDate = moment(roundedDateTime).add({ hours: 11, minutes: 59 }).toDate();
	
	return Q.all<{}>([
		getQuotes(startDate, endDate),
		getPortfolio(startDate, endDate),
		getOptions(startDate, endDate)
	])
	.spread<MonitoringData>((
		quotes: Quote[],
		portfolio: Portfolio[],
		options: BinaryOption[]
	) => ({ startDate, endDate, quotes, portfolio, options }));
}

function getFirstQuoteDate(): Q.Promise<[{ dateTime: Date }]> {
	return Q.ninvoke<[{ dateTime: Date }]>(
		DbManager.db.collection('quotes'), 'aggregate', [
			{ $group: { _id: null, dateTime: { $min: '$dateTime' }}}
		]
	);
}

function getFirstPortfolioDate(): Q.Promise<[{ dateTime: Date }]> {
	return Q.ninvoke<[{ dateTime: Date }]>(
		DbManager.db.collection('portfolio'), 'aggregate', [
			{ $group: { _id: null, dateTime: { $min: '$dateTime' }}}
		]
	);
}

function getFirstOptionDate(): Q.Promise<[{ dateTime: Date }]> {
	return Q.ninvoke<[{ dateTime: Date }]>(
		DbManager.db.collection('options'), 'aggregate', [
			{ $group: { _id: null, dateTime: { $min: '$quote.dateTime' }}}
		]
	);
}

function getLastQuoteDate(): Q.Promise<[{ dateTime: Date }]> {
	return Q.ninvoke<[{ dateTime: Date }]>(
		DbManager.db.collection('quotes'), 'aggregate', [
			{ $group: { _id: null, dateTime: { $max: '$dateTime' }}}
		]
	);
}

function getLastPortfolioDate(): Q.Promise<[{ dateTime: Date }]> {
	return Q.ninvoke<[{ dateTime: Date }]>(
		DbManager.db.collection('portfolio'), 'aggregate', [
			{ $group: { _id: null, dateTime: { $max: '$dateTime' }}}
		]
	);
}

function getLastOptionDate(): Q.Promise<[{ dateTime: Date }]> {
	return Q.ninvoke<[{ dateTime: Date }]>(
		DbManager.db.collection('options'), 'aggregate', [
			{ $group: { _id: null, dateTime: { $max: '$quote.dateTime' }}}
		]
	);
}

function getQuotes(startDate: Date, endDate: Date): Q.Promise<Quote[]> {
	return Q.ninvoke<Quote[]>(DbManager.db.collection('quotes'), 'aggregate', [
		{ $match: { dateTime: { $gte: startDate, $lte: endDate }}},
		{ $sort: { dateTime: 1 }},
		{ $project: {
			_id: 0,
			dateTime: 1,
			close: 1
		}}
	]);
}

function getPortfolio(startDate: Date, endDate: Date): Q.Promise<Portfolio[]> {
	return Q.ninvoke<Portfolio[]>(DbManager.db.collection('portfolio'), 'aggregate', [
		{ $match: { dateTime: { $gte: startDate, $lte: endDate }}},
		{ $sort: { dateTime: 1 }},
		{ $project: {
			_id: 0,
			dateTime: 1,
			value: 1
		}}
	]);
}

function getOptions(startDate: Date, endDate: Date): Q.Promise<BinaryOption[]> {
	return Q.ninvoke<BinaryOption[]>(DbManager.db.collection('options'), 'aggregate', [
		{ $match: { 'quote.dateTime': { $gte: startDate, $lte: endDate }}},
		{ $sort: { 'quote.dateTime': 1 }},
		{ $project: {
			_id: 0,
			quote: { dateTime: 1, close: 1 },
			expiration: 1,
			direction: 1
		}}
	]);
}

export = router;