/// <reference path="../../typings/tsd.d.ts" />
var Q = require('q');
var mongodb = require('mongodb');
function connect(dbName) {
    if (dbName === void 0) { dbName = 'dry-moose'; }
    return Q.nfcall(mongodb.MongoClient.connect, 'mongodb://localhost:27017/' + dbName)
        .then(function (db) {
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
            .then(function () {
            return db;
        });
    });
}
exports.connect = connect;
