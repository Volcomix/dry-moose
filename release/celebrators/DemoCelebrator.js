/// <reference path="../../typings/tsd.d.ts" />
var Q = require('q');
var DbManager = require('../database/DbManager');
var BinaryOption = require('../documents/options/BinaryOption');
var DemoCelebrator = (function () {
    function DemoCelebrator(db) {
        this.db = db;
    }
    DemoCelebrator.prototype.getGain = function (option) {
        var _this = this;
        return Q.when(this.db ||
            DbManager.connect().then(function (db) { return _this.db = db; }))
            .then(function (db) {
            return Q.ninvoke(db.collection('quotes'), 'aggregate', [
                { $match: { dateTime: {
                            $gt: option.quote.dateTime,
                            $lte: option.expiration
                        } } },
                { $sort: { dateTime: -1 } },
                { $limit: 1 },
                { $match: { close: (option.direction == BinaryOption.Direction.Call ?
                            { $gte: option.quote.close } :
                            { $lte: option.quote.close }) } }
            ]);
        })
            .then(function (quotes) {
            return quotes.length * option.amount * (1 + option.payout);
        });
    };
    return DemoCelebrator;
})();
module.exports = DemoCelebrator;
