/// <reference path="../../typings/tsd.d.ts" />
var Q = require('q');
var DbManager = require('../database/DbManager');
var BinaryOption = require('../documents/options/BinaryOption');
var DemoCelebrator = (function () {
    function DemoCelebrator() {
    }
    DemoCelebrator.prototype.getGain = function (option) {
        return DbManager.db
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
