/// <reference path="../../typings/tsd.d.ts" />

import express = require('express');
import Q = require('q');

import DbManager = require('../database/DbManager');
import Quote = require('../documents/Quote');

var router = express.Router();

router.get('/quotes', function(req, res, next) {
	var cursor = DbManager.db.collection('quotes').find();
	Q.ninvoke(cursor, 'toArray')
	.then(function(quotes: Quote[]) {
		res.send(quotes);
	});
});

export = router;