/// <reference path="../../typings/tsd.d.ts" />
var Q = require('q');
var DbManager = require('../database/DbManager');
var DemoCapacitor = (function () {
    function DemoCapacitor(initialValue, db) {
        this.initialValue = initialValue;
        this.db = db;
    }
    DemoCapacitor.prototype.getPortfolio = function () {
        var _this = this;
        return Q.when(this.db ||
            DbManager.connect().then(function (db) { return _this.db = db; }))
            .then(function (db) {
            var cursor = db.collection('portfolio')
                .find()
                .sort({ dateTime: -1 })
                .limit(1);
            return Q.ninvoke(cursor, 'next');
        })
            .then(function (portfolio) {
            return portfolio ? portfolio.value : _this.initialValue;
        });
    };
    return DemoCapacitor;
})();
module.exports = DemoCapacitor;
