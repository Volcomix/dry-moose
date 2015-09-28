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
    Supervisor.prototype.run = function () {
        var _this = this;
        var inProgress = Q(null);
        return this.init()
            .then(function () {
            return _this.collector.collect();
        })
            .progress(function (quote) {
            inProgress = inProgress.then(function () {
                return _this.handleQuote(quote);
            });
        })
            .finally(function () {
            return inProgress.then(function () {
                return _this.done();
            });
        });
    };
    Supervisor.prototype.init = function () {
        var _this = this;
        return DbManager.connect()
            .then(function () {
            return _this.capacitor.getPortfolio();
        })
            .then(function (portfolio) {
            _this.innerPortfolio = portfolio;
        });
    };
    Supervisor.prototype.handleQuote = function (quote) {
        var _this = this;
        return Q.ninvoke(DbManager.db.collection('quotes'), 'insertOne', quote)
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
                        Q.ninvoke(DbManager.db.collection('portfolio'), 'insertOne', {
                            dateTime: option.expiration,
                            value: _this.innerPortfolio
                        }),
                        Q.ninvoke(DbManager.db.collection('gains'), 'insertOne', {
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
            var option = _this.processor.process(portfolio, quote, !!_this.pendingOption);
            if (option) {
                _this.innerPortfolio -= option.amount;
                return Q.all([
                    Q.ninvoke(DbManager.db.collection('options'), 'insertOne', option),
                    Q.ninvoke(DbManager.db.collection('portfolio'), 'insertOne', {
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
    };
    Supervisor.prototype.done = function () {
        return DbManager.close();
    };
    return Supervisor;
})();
module.exports = Supervisor;
