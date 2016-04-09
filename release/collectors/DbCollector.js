"use strict";
var Q = require('q');
var DbManager = require('../database/DbManager');
var DbCollector = (function () {
    function DbCollector(collectionName, limit) {
        this.collectionName = collectionName;
        this.limit = limit;
    }
    DbCollector.prototype.collect = function () {
        var _this = this;
        return Q.Promise(function (resolve, reject, notify) {
            var cursor = DbManager.db.collection(_this.collectionName).find({});
            if (_this.limit) {
                cursor.limit(_this.limit);
            }
            cursor.forEach(function (quote) { return notify(quote); }, function (err) {
                if (err)
                    return reject(err);
                else
                    return resolve(null);
            });
        });
    };
    return DbCollector;
}());
module.exports = DbCollector;
