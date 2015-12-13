/// <reference path="../../../typings/tsd.d.ts" />

import express = require('express');
import Q = require('q');
import moment = require('moment');

import DbManager = require('../../database/DbManager');
import Quote = require('../../documents/Quote');
import MACD = require('../../documents/MACD');
import MACross = require('../../documents/MACross');
import Portfolio = require('../../documents/Portfolio');
import Gain = require('../../documents/Gain');
import MonitoringData = require('../../documents/MonitoringData');
import QuotesService = require('./services/QuotesService');
import MACDService = require('./services/MACDService');
import MACrossService = require('./services/MACrossService');
import PortfolioService = require('./services/PortfolioService');
import GainsService = require('./services/GainsService');

var router = express.Router();

router.get('/minutes/first', function(req, res, next) {
	var firstDate: moment.Moment;
	Q.all([
		QuotesService.getFirstDate(),
		PortfolioService.getFirstDate(),
		GainsService.getFirstDate()])
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
	Q.all([
		QuotesService.getLastDate(),
		PortfolioService.getLastDate(),
		GainsService.getLastDate()])
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
		roundedDateTime.add({ days: 1 }).startOf('day');
	} else {
		roundedDateTime.hour(12).startOf('hour');
	}
	
	var startDate = moment(roundedDateTime).subtract({ hours: 12 }).toDate(),
		endDate = moment(roundedDateTime).add({ hours: 11, minutes: 59 }).toDate();
	
	return Q.all<{}>([
		QuotesService.get(startDate, endDate)
		.then(quotes => [
			quotes,
			MACDService.get(quotes),
			MACrossService.get(quotes, 9, 21)
		])
		.spread((
			quotes: Quote[],
			macd: MACD[],
			maCross: MACross
		) => ({ quotes, macd, maCross })),
		PortfolioService.get(startDate, endDate),
		GainsService.get(startDate, endDate)
	])
	.spread<MonitoringData>((
		{ quotes, macd, maCross },
		portfolio: Portfolio[],
		gains: Gain[]
	) => ({ startDate, endDate, quotes, macd, maCross, portfolio, gains }));
}

export = router;