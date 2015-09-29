/// <reference path="../../typings/tsd.d.ts" />
var express = require('express');
var DbManager = require('../database/DbManager');
var Routes = require('./Routes');
var app = express();
app.use('/', Routes);
app.use(express.static('www'));
app.use('/javascripts', express.static('release/www'));
DbManager.connect()
    .then(function () {
    var server = app.listen(8080, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Monitoring listening at http://%s:%s', host, port);
    });
});
