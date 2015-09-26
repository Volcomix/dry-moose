/// <reference path="../../typings/tsd.d.ts" />
var fs = require('fs');
var readline = require('readline');
var Q = require('q');
var moment = require('moment');
var GenericASCIIM1 = (function () {
    function GenericASCIIM1(filename, rewards) {
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
                var quote = {
                    dateTime: dateTime.toDate(),
                    open: open,
                    high: high,
                    low: low,
                    close: close,
                    volume: volume,
                    rewards: _this.rewards.map(function (reward) {
                        var expirationOffset = moment(reward.expiration);
                        var minutes = expirationOffset.minutes();
                        var expiration = dateTime.clone()
                            .set('minutes', minutes * Math.ceil(dateTime.minutes() / minutes))
                            .set('seconds', 0)
                            .add({ hours: expirationOffset.hours(), minutes: minutes });
                        var countdownOffset = moment(reward.countdown);
                        var countdown = expiration.clone()
                            .subtract({
                            hours: countdownOffset.hours(),
                            minutes: countdownOffset.minutes()
                        });
                        return {
                            countdown: countdown.toDate(),
                            expiration: expiration.toDate(),
                            payout: reward.payout
                        };
                    })
                };
                notify(quote);
            });
            rl.on('close', resolve);
        });
    };
    return GenericASCIIM1;
})();
module.exports = GenericASCIIM1;
