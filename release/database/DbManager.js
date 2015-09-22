/// <reference path="../../typings/tsd.d.ts" />
var Q = require('q');
var mongodb = require('mongodb');
exports.db = Q.nfcall(mongodb.MongoClient.connect, 'mongodb://localhost:27017/dry-moose');
