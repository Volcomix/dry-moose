/// <reference path="../../typings/tsd.d.ts" />
var mongodb = require('mongodb');
var Q = require('q');
var moment = require('moment');
var DbManager = require('../database/DbManager');
var MongoClient = mongodb.MongoClient;
/**
 * Collect trading quotes
 */
var AbstractCollector = (function () {
    function AbstractCollector(processor, investor, celebrator) {
        this.processor = processor;
        this.investor = investor;
        this.celebrator = celebrator;
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
                }),
                Q.ninvoke(_this.db.collection('rewards'), 'createIndex', {
                    'dateTime': 1
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
                quote: quote,
                rewards: rewards
            });
        })
            .then(function () {
            if (_this.pendingOption &&
                // dateTime >= exp
                !moment(quote.dateTime).isBefore(_this.pendingOption.expiration)) {
                var option = _this.pendingOption;
                _this.pendingOption = undefined;
                return _this.celebrator.getGain(option)
                    .then(function (gain) {
                    return Q.ninvoke(_this.db.collection('rewards'), 'insertOne', {
                        dateTime: option.expiration,
                        gain: gain
                    });
                });
            }
        })
            .then(function () {
            if (_this.pendingOption) {
                return;
            }
            var option = _this.processor.process(quote, rewards);
            if (option) {
                return Q.ninvoke(_this.db.collection('options'), 'insertOne', option)
                    .then(function () {
                    _this.pendingOption = option;
                    _this.investor.invest(option);
                });
            }
        });
    };
    return AbstractCollector;
})();
module.exports = AbstractCollector;
