"use strict";
var Q = require('q');
var mongodb = require('mongodb');
/**
 * Connect to mongodb and init indexes. Return any existing
 * db if already connected.
 */
function connect(dbName) {
    if (dbName === void 0) { dbName = 'dry-moose'; }
    return (exports.db && Q(exports.db)) || Q.nfcall(mongodb.MongoClient.connect, 'mongodb://localhost:27017/' + dbName)
        .then(function (connectedDb) {
        exports.db = connectedDb;
        return [
            Q.ninvoke(exports.db.collection('quotes'), 'createIndex', {
                'dateTime': 1
            }),
            Q.ninvoke(exports.db.collection('options'), 'createIndex', {
                'quote.dateTime': 1
            }),
            Q.ninvoke(exports.db.collection('options'), 'createIndex', {
                'expiration': 1
            }),
            Q.ninvoke(exports.db.collection('gains'), 'createIndex', {
                'dateTime': 1
            }),
            Q.ninvoke(exports.db.collection('portfolio'), 'createIndex', {
                'dateTime': 1
            })
        ];
    })
        .spread(function () {
        return exports.db;
    });
}
exports.connect = connect;
function close() {
    var closingDb = exports.db;
    exports.db = undefined;
    return Q.ninvoke(closingDb, 'close');
}
exports.close = close;
