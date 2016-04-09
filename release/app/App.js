"use strict";
var express = require('express');
var DbManager = require('../database/DbManager');
var Monitoring = require('./routes/Monitoring');
var app = express();
app.use(express.static('www'));
app.use('/monitoring', Monitoring);
app.use('/javascripts', express.static('release/app/www'));
DbManager.connect()
    .then(function () {
    var server = app.listen(8080, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Dry-moose listening at http://%s:%s', host, port);
    });
});
