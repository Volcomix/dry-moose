/// <reference path="../../typings/tsd.d.ts" />
var Q = require('q');
var DbManager = require('../database/DbManager');
var DemoCapacitor = (function () {
    function DemoCapacitor(initialValue) {
        this.initialValue = initialValue;
    }
    DemoCapacitor.prototype.getPortfolio = function () {
        var _this = this;
        return DbManager.db
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
