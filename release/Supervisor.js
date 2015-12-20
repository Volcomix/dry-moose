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
            return inProgress.finally(function () {
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
                return _this.getGain();
            }
        })
            .then(function () {
            return _this.getPortfolio();
        })
            .then(function (portfolio) {
            if (portfolio <= 0) {
                throw new Error('Portfolio is empty... Game Over!');
            }
            var option = _this.process(portfolio, quote);
            if (option) {
                return _this.invest(quote, option);
            }
        });
    };
    Supervisor.prototype.done = function () {
        var _this = this;
        return Q(this.pendingOption)
            .then(function (pendingOption) {
            if (pendingOption) {
                return _this.getGain();
            }
        })
            .then(function () {
            return DbManager.close();
        });
    };
    Supervisor.prototype.getGain = function () {
        var _this = this;
        var option = this.pendingOption;
        this.pendingOption = undefined;
        return this.celebrator.getGain(option)
            .then(function (gain) {
            _this.innerPortfolio += gain.value;
            return Q.all([
                Q.ninvoke(DbManager.db.collection('portfolio'), 'insertOne', {
                    dateTime: option.expiration,
                    value: _this.innerPortfolio
                }),
                Q.ninvoke(DbManager.db.collection('gains'), 'insertOne', gain)
            ]);
        });
    };
    Supervisor.prototype.getPortfolio = function () {
        var _this = this;
        return this.capacitor.getPortfolio()
            .then(function (portfolio) {
            if (_this.innerPortfolio != portfolio) {
                throw new Error('Estimated portfolio and real portfolio are different ' +
                    JSON.stringify({
                        estimated: _this.innerPortfolio,
                        real: portfolio
                    }));
            }
            return portfolio;
        });
    };
    Supervisor.prototype.process = function (portfolio, quote) {
        return this.processor.process(portfolio, quote, !!this.pendingOption);
    };
    Supervisor.prototype.invest = function (quote, option) {
        var _this = this;
        this.innerPortfolio -= option.amount;
        return Q.all([
            Q.ninvoke(DbManager.db.collection('options'), 'insertOne', option),
            Q.ninvoke(DbManager.db.collection('portfolio'), 'insertOne', {
                dateTime: quote.dateTime,
                value: this.innerPortfolio
            })
        ])
            .then(function () {
            _this.pendingOption = option;
            _this.investor.invest(option);
        });
    };
    return Supervisor;
})();
module.exports = Supervisor;
