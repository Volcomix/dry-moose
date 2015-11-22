/// <reference path="../../typings/tsd.d.ts" />
var Q = require('q');
var DbManager = require('../database/DbManager');
var BinaryOption = require('../documents/options/BinaryOption');
var DemoCelebrator = (function () {
    function DemoCelebrator() {
    }
    DemoCelebrator.prototype.getGain = function (option) {
        var _this = this;
        return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
            { $match: { dateTime: {
                        $gt: option.quote.dateTime,
                        $lte: option.expiration
                    } } },
            { $sort: { dateTime: -1 } },
            { $limit: 1 }
        ])
            .spread(function (quote) { return ({
            option: option,
            quote: quote,
            dateTime: option.expiration,
            value: _this.getGainFromQuote(option, quote)
        }); });
    };
    DemoCelebrator.prototype.getGainFromQuote = function (option, quote) {
        if (!quote)
            return 0;
        switch (option.direction) {
            case BinaryOption.Direction.Call:
                if (quote.close >= option.quote.close) {
                    return this.getOptionGain(option);
                }
                break;
            case BinaryOption.Direction.Put:
                if (quote.close <= option.quote.close) {
                    return this.getOptionGain(option);
                }
                break;
        }
        return 0;
    };
    DemoCelebrator.prototype.getOptionGain = function (option) {
        return option.amount * (1 + option.payout);
    };
    return DemoCelebrator;
})();
module.exports = DemoCelebrator;
