import Q = require('q');
import mongodb = require('mongodb');

/**
 * Be sure to call connect() before getting db
 */
export var db: mongodb.Db;

/**
 * Connect to mongodb and init indexes. Return any existing
 * db if already connected.
 */
export function connect(dbName: string = 'dry-moose') {
	return (db && Q(db)) || Q.nfcall<mongodb.Db>(
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

export function close() {
	var closingDb = db;
	db = undefined;
	return Q.ninvoke<void>(closingDb, 'close');
}