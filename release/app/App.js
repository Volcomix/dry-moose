/// <reference path="../../typings/tsd.d.ts" />
var express = require('express');
var DbManager = require('../database/DbManager');
var Monitoring = require('./routes/Monitoring');
var app = express();
app.use('/monitoring', Monitoring);
app.use(express.static('www'));
app.use('/javascripts', express.static('release/app/www'));
DbManager.connect()
    .then(function () {
    var server = app.listen(8080, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Monitoring listening at http://%s:%s', host, port);
    });
});
