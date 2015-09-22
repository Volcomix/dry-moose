/// <reference path="../../typings/tsd.d.ts" />
var mongodb = require('mongodb');
var Q = require('q');
var DbManager = require('../database/DbManager');
var MongoClient = mongodb.MongoClient;
/**
 * Collect trading quotes
 */
var AbstractCollector = (function () {
    function AbstractCollector(processor, investor) {
        this.processor = processor;
        this.investor = investor;
    }
    AbstractCollector.prototype.run = function () {
        var _this = this;
        return DbManager.db
            .then(function (db) {
            _this.db = db;
            return [
                Q.ninvoke(_this.db.collection('quotes'), 'createIndex', {
                    'quote.dateTime': 1
                }),
                Q.ninvoke(_this.db.collection('options'), 'createIndex', {
                    'expiration': 1
                })
            ];
        })
            .spread(function () {
            return _this.collect();
        })
            .finally(function () {
            return Q.when(_this.pendingDb, function () {
                return Q.ninvoke(_this.db, 'close');
            });
        });
    };
    AbstractCollector.prototype.process = function (quote, rewards) {
        var _this = this;
        this.pendingDb = Q.when(this.pendingDb, function () {
            return Q.ninvoke(_this.db.collection('quotes'), 'insertOne', {
                quote: quote.toDocument(),
                rewards: rewards.map(function (reward) { return reward.toDocument(); })
            });
        })
            .then(function () {
            if (_this.pendingOption && quote.dateTime >= _this.pendingOption.expiration) {
            }
        })
            .then(function () {
            var option = _this.processor.process(quote, rewards);
            if (option) {
                return Q.ninvoke(_this.db.collection('options'), 'insertOne', option.toDocument())
                    .then(function () {
                    _this.investor.invest(option);
                });
            }
        });
    };
    return AbstractCollector;
})();
module.exports = AbstractCollector;
