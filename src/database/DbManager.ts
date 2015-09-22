/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');
import mongodb = require('mongodb');

export var db = Q.nfcall<mongodb.Db>(
	mongodb.MongoClient.connect,
	'mongodb://localhost:27017/dry-moose'
);