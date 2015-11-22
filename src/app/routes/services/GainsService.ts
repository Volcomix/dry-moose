/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');

import DbManager = require('../../../database/DbManager');
import Gain = require('../../../documents/Gain');

export function getFirstDate(): Q.Promise<[{ dateTime: Date }]> {
	return Q.ninvoke<[{ dateTime: Date }]>(
		DbManager.db.collection('gains'), 'aggregate', [
			{ $group: { _id: null, dateTime: { $min: '$option.quote.dateTime' }}}
		]
	);
}

export function getLastDate(): Q.Promise<[{ dateTime: Date }]> {
	return Q.ninvoke<[{ dateTime: Date }]>(
		DbManager.db.collection('gains'), 'aggregate', [
			{ $group: { _id: null, dateTime: { $max: '$dateTime' }}}
		]
	);
}

export function get(startDate: Date, endDate: Date): Q.Promise<Gain[]> {
	return Q.ninvoke<Gain[]>(DbManager.db.collection('gains'), 'aggregate', [
		{ $match: { dateTime: { $gte: startDate, $lte: endDate }}},
		{ $sort: { dateTime: 1 }},
		{ $project: {
			_id: 0,
			option: {
				quote: { dateTime: 1, close: 1 },
				expiration: 1,
				direction: 1
			},
			quote: { dateTime: 1, close: 1 },
			dateTime: 1,
			value: 1
		}}
	]);
}