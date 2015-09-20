/// <reference path="../../typings/tsd.d.ts" />
var mongodb = require('mongodb');
var Q = require('q');
var MongoClient = mongodb.MongoClient;
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
            Q.ninvoke(_this.db.collection('process'), 'insertOne', {
                quote: quote.toDocument(),
                rewards: rewards.map(function (reward) { return reward.toDocument(); })
            });
        })
            .then(function () {
            var option = _this.processor.process(quote, rewards);
            if (option) {
                _this.investor.invest(option);
            }
            return option;
        });
    };
    return AbstractCollector;
})();
module.exports = AbstractCollector;
