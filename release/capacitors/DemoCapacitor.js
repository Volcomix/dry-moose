/// <reference path="../../typings/tsd.d.ts" />
var Q = require('q');
var DbManager = require('../database/DbManager');
var DemoCapacitor = (function () {
    function DemoCapacitor() {
    }
    DemoCapacitor.prototype.getPortfolio = function () {
        return DbManager.db
            .then(function (db) {
            var cursor = db.collection('portfolio').find().sort({ 'dateTime': -1 });
            return Q.ninvoke(cursor, 'limit', 1);
        })
            .then(function (portfolio) {
            return portfolio.value;
        });
    };
    return DemoCapacitor;
})();
