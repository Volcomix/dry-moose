/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');
import mongodb = require('mongodb');

/**
 * Be sure to call connect() before getting db
 */
export var db: mongodb.Db;

export function connect(dbName: string = 'dry-moose') {
	return Q.nfcall<mongodb.Db>(
		mongodb.MongoClient.connect,
		'mongodb://localhost:27017/'  + dbName
	)
	.then(function(connectedDb) {
		db = connectedDb;
		return [
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
		];
	})
	.spread(function() {
		return db;
	});
}