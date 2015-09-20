/// <reference path="../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fs = require('fs');
var readline = require('readline');
var Q = require('q');
var moment = require('moment');
var AbstractCollector = require('./AbstractCollector');
var ForexQuote = require('../quotes/ForexQuote');
var GenericASCIIM1 = (function (_super) {
    __extends(GenericASCIIM1, _super);
    function GenericASCIIM1(processor, investor, filename, rewards) {
        _super.call(this, processor, investor);
        this.filename = filename;
        this.rewards = rewards;
    }
    GenericASCIIM1.prototype.collect = function () {
        var _this = this;
        return Q.Promise(function (resolve, reject, notify) {
            var rs = fs.createReadStream(_this.filename);
            rs.on('error', reject);
            var rl = readline.createInterface({
                input: rs,
                output: null
            });
            rl.on('line', function (line) {
                var arr = line.split(';');
                var dateTime = moment(arr[0] + '-0500', 'YYYYMMDD hhmmssZ');
                var open = parseFloat(arr[1]);
                var high = parseFloat(arr[2]);
                var low = parseFloat(arr[3]);
                var close = parseFloat(arr[4]);
                var volume = parseFloat(arr[5]);
                var quote = new ForexQuote(dateTime, open, high, low, close, volume);
                var rewards = _this.rewards.map(function (reward) {
                    return {
                        expiration: dateTime.clone().add({
                            hours: reward.expiration.hours(),
                            minutes: reward.expiration.minutes()
                        }),
                        payout: reward.payout
                    };
                });
                _this.process(quote, rewards);
            });
            rl.on('close', resolve);
        });
    };
    return GenericASCIIM1;
})(AbstractCollector);
module.exports = GenericASCIIM1;
