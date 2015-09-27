/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');
import mongodb = require('mongodb');

export function connect(dbName: string = 'dry-moose') {
	return Q.nfcall<mongodb.Db>(
		mongodb.MongoClient.connect,
		'mongodb://localhost:27017/'  + dbName
	)
	.then(function(db) {
		return Q.all([
			Q.ninvoke(db.collection('quotes'), 'createIndex', {
				'dateTime': 1
			}),
			Q.ninvoke(db.collection('options'), 'createIndex', {
				'quote.dateTime': 1
			}),
			Q.ninvoke(db.collection('options'), 'createIndex', {
				'expiration': 1
			}),
			Q.ninvoke(db.collection('gains'), 'createIndex', {
				'dateTime': 1
			}),
			Q.ninvoke(db.collection('portfolio'), 'createIndex', {
				'dateTime': 1
			})
		])
		.then(function() {
			return db;
		});
	});
}