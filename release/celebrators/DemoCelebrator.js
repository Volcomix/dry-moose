/// <reference path="../../typings/tsd.d.ts" />
var Q = require('q');
var DbManager = require('../database/DbManager');
var BinaryOption = require('../options/BinaryOption');
var DemoCelebrator = (function () {
    function DemoCelebrator() {
    }
    DemoCelebrator.prototype.getGain = function (quote, option) {
        return DbManager.db
            .then(function (db) {
            var cursor = db.collection('quotes')
                .find({
                'quote.dateTime': {
                    $gt: quote.dateTime,
                    $lte: option.expiration.toDate()
                },
                'quote.close': (option.direction == BinaryOption.Direction.Call ?
                    { $gte: quote.close } :
                    { $lte: quote.close })
            })
                .sort({ 'quote.dateTime': -1 })
                .limit(1);
            return Q.ninvoke(cursor, 'count', true);
        })
            .then(function (count) {
            return count * option.amount * (1 + option.payout);
        });
    };
    return DemoCelebrator;
})();
module.exports = DemoCelebrator;
