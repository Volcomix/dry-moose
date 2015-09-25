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
            var cursor = db.collection('quotes')
                .find({
                'quote.dateTime': {
                    $gt: option.quote.dateTime,
                    $lte: option.expiration
                },
                'quote.close': (option.direction == BinaryOption.Direction.Call ?
                    { $gte: option.quote.close } :
                    { $lte: option.quote.close })
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
