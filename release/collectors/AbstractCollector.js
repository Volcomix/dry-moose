/// <reference path="../../typings/tsd.d.ts" />
var mongodb = require('mongodb');
var Q = require('q');
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
        return Q.nfcall(MongoClient.connect, 'mongodb://localhost:27017/dry-moose')
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
            return Q.when(_this.pending, function () {
                return Q.ninvoke(_this.db, 'close');
            });
        });
    };
    AbstractCollector.prototype.process = function (quote, rewards) {
        var _this = this;
        this.pending = Q.when(this.pending, function () {
            Q.ninvoke(_this.db.collection('quotes'), 'insertOne', {
                quote: quote.toDocument(),
                rewards: rewards.map(function (reward) { return reward.toDocument(); })
            });
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
