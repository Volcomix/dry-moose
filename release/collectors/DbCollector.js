/// <reference path="../../typings/tsd.d.ts" />
var Q = require('q');
var DbManager = require('../database/DbManager');
var DbCollector = (function () {
    function DbCollector(collectionName) {
        this.collectionName = collectionName;
    }
    DbCollector.prototype.collect = function () {
        var _this = this;
        return Q.Promise(function (resolve, reject, notify) {
            var cursor = DbManager.db.collection(_this.collectionName).find();
            cursor.each(function (err, quote) {
                if (err)
                    return reject(err);
                if (quote == null)
                    return resolve(null);
                notify(quote);
            });
        });
    };
    return DbCollector;
})();
module.exports = DbCollector;
