/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');

import DbManager = require('../../../database/DbManager');
import BinaryOption = require('../../../documents/options/BinaryOption');

export function getFirstDate(): Q.Promise<[{ dateTime: Date }]> {
	return Q.ninvoke<[{ dateTime: Date }]>(
		DbManager.db.collection('options'), 'aggregate', [
			{ $group: { _id: null, dateTime: { $min: '$quote.dateTime' }}}
		]
	);
}

export function getLastDate(): Q.Promise<[{ dateTime: Date }]> {
	return Q.ninvoke<[{ dateTime: Date }]>(
		DbManager.db.collection('options'), 'aggregate', [
			{ $group: { _id: null, dateTime: { $max: '$quote.dateTime' }}}
		]
	);
}

export function get(startDate: Date, endDate: Date): Q.Promise<BinaryOption[]> {
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