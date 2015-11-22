/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');

import DbManager = require('../../../database/DbManager');
import Quote = require('../../../documents/Quote');

export function getFirstDate(): Q.Promise<[{ dateTime: Date }]> {
	return Q.ninvoke<[{ dateTime: Date }]>(
		DbManager.db.collection('quotes'), 'aggregate', [
			{ $group: { _id: null, dateTime: { $min: '$dateTime' }}}
		]
	);
}

export function getLastDate(): Q.Promise<[{ dateTime: Date }]> {
	return Q.ninvoke<[{ dateTime: Date }]>(
		DbManager.db.collection('quotes'), 'aggregate', [
			{ $group: { _id: null, dateTime: { $max: '$dateTime' }}}
		]
	);
}

export function get(startDate: Date, endDate: Date): Q.Promise<Quote[]> {
	return Q.ninvoke<Quote[]>(DbManager.db.collection('quotes'), 'aggregate', [
		{ $match: { dateTime: { $gte: startDate, $lte: endDate }}},
		{ $sort: { dateTime: 1 }},
		{ $project: { _id: 0, dateTime: 1, close: 1 }}
	]);
}