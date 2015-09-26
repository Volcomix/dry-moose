/// <reference path="../typings/tsd.d.ts" />
var Q = require('q');
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
                    'quote.dateTime': 1
                }),
                Q.ninvoke(_this.db.collection('options'), 'createIndex', {
                    'expiration': 1
                }),
                Q.ninvoke(_this.db.collection('rewards'), 'createIndex', {
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
            .progress(function (progress) {
            _this.pendingDb = Q.when(_this.pendingDb, function () {
                return Q.ninvoke(_this.db.collection('quotes'), 'insertOne', progress);
            })
                .then(function () {
                if (_this.pendingOption &&
                    // dateTime >= exp
                    !moment(progress.quote.dateTime).isBefore(_this.pendingOption.expiration)) {
                    var option = _this.pendingOption;
                    _this.pendingOption = undefined;
                    return _this.celebrator.getGain(option)
                        .then(function (gain) {
                        _this.innerPortfolio += gain;
                        return Q.all([
                            Q.ninvoke(_this.db.collection('portfolio'), 'insertOne', {
                                dateTime: option.expiration,
                                portfolio: _this.innerPortfolio
                            }),
                            Q.ninvoke(_this.db.collection('rewards'), 'insertOne', {
                                dateTime: option.expiration,
                                gain: gain
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
                    throw new Error('Estimated portfolio and real portfolio are different');
                }
                if (_this.pendingOption) {
                    return;
                }
                var option = _this.processor.process(portfolio, progress.quote, progress.rewards);
                if (option) {
                    return Q.ninvoke(_this.db.collection('options'), 'insertOne', option)
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
