/// <reference path="../../typings/tsd.d.ts" />

import express = require('express');

import DbManager = require('../database/DbManager');
import Routes = require('./Routes');

var app = express();

app.use('/', Routes);

DbManager.connect()
.then(function() {
	var server = app.listen(8080, function () {
		var host = server.address().address;
		var port = server.address().port;
		
		console.log('Monitoring listening at http://%s:%s', host, port);
	});
});