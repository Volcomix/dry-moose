/// <reference path="../typings/tsd.d.ts" />
var Q = require('q');
var moment = require('moment');
var DbManager = require('./database/DbManager');
/**
 * Main class which supervises everything
 */
var Supervisor = (function () {
    function Supervisor(collector, processor, investor, celebrator, capacitor) {
        this.collector = collector;
        this.processor = processor;
        this.investor = investor;
        this.celebrator = celebrator;
        this.capacitor = capacitor;
    }
    Supervisor.prototype.init = function () {
        var _this = this;
        return DbManager.db
            .then(function (db) {
            _this.db = db;
            return [
                Q.ninvoke(_this.db.collection('quotes'), 'createIndex', {
                    'dateTime': 1
                }),
                Q.ninvoke(_this.db.collection('options'), 'createIndex', {
                    'quote.dateTime': 1
                }),
                Q.ninvoke(_this.db.collection('options'), 'createIndex', {
                    'expiration': 1
                }),
                Q.ninvoke(_this.db.collection('gains'), 'createIndex', {
                    'dateTime': 1
                }),
                Q.ninvoke(_this.db.collection('portfolio'), 'createIndex', {
                    'dateTime': 1
                })
            ];
        })
            .spread(function () {
            return _this.capacitor.getPortfolio();
        })
            .then(function (portfolio) {
            return _this.innerPortfolio = portfolio;
        });
    };
    Supervisor.prototype.run = function () {
        var _this = this;
        return this.init()
            .then(function () {
            return _this.collector.collect();
        })
            .progress(function (quote) {
            _this.pendingDb = Q.when(_this.pendingDb, function () {
                return Q.ninvoke(_this.db.collection('quotes'), 'insertOne', quote);
            })
                .then(function () {
                if (_this.pendingOption &&
                    // dateTime >= exp
                    !moment(quote.dateTime).isBefore(_this.pendingOption.expiration)) {
                    var option = _this.pendingOption;
                    _this.pendingOption = undefined;
                    return _this.celebrator.getGain(option)
                        .then(function (gain) {
                        _this.innerPortfolio += gain;
                        return Q.all([
                            Q.ninvoke(_this.db.collection('portfolio'), 'insertOne', {
                                dateTime: option.expiration,
                                value: _this.innerPortfolio
                            }),
                            Q.ninvoke(_this.db.collection('gains'), 'insertOne', {
                                dateTime: option.expiration,
                                value: gain
                            })
                        ]);
                    });
                }
            })
                .then(function () {
                return _this.capacitor.getPortfolio();
            })
                .then(function (portfolio) {
                if (_this.innerPortfolio != portfolio) {
                    throw new Error('Estimated portfolio and real portfolio are different ' +
                        JSON.stringify({
                            estimated: _this.innerPortfolio,
                            real: portfolio
                        }));
                }
                if (_this.pendingOption) {
                    return;
                }
                var option = _this.processor.process(portfolio, quote);
                if (option) {
                    _this.innerPortfolio -= option.amount;
                    return Q.all([
                        Q.ninvoke(_this.db.collection('options'), 'insertOne', option),
                        Q.ninvoke(_this.db.collection('portfolio'), 'insertOne', {
                            dateTime: quote.dateTime,
                            value: _this.innerPortfolio
                        })
                    ])
                        .then(function () {
                        _this.pendingOption = option;
                        _this.investor.invest(option);
                    });
                }
            });
        })
            .finally(function () {
            return Q.when(_this.pendingDb, function () {
                return Q.ninvoke(_this.db, 'close');
            });
        });
    };
    return Supervisor;
})();
module.exports = Supervisor;
