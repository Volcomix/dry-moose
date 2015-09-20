/// <reference path="../../typings/tsd.d.ts" />
var Reward = (function () {
    function Reward(expiration, payout) {
        this._expiration = expiration;
        this._payout = payout;
    }
    Object.defineProperty(Reward.prototype, "expiration", {
        get: function () {
            return this._expiration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Reward.prototype, "payout", {
        get: function () {
            return this._payout;
        },
        enumerable: true,
        configurable: true
    });
    Reward.prototype.toDocument = function () {
        return {
            expiration: this.expiration.toDate(),
            payout: this.payout
        };
    };
    return Reward;
})();
module.exports = Reward;
