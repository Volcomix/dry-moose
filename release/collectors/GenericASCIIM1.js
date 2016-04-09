"use strict";
var fs = require('fs');
var readline = require('readline');
var Q = require('q');
var moment = require('moment');
var GenericASCIIM1 = (function () {
    function GenericASCIIM1(filename, rewards) {
        this.filename = filename;
        this.rewards = rewards;
        this.getOffset = function (date) {
            var offset = moment(date);
            return moment.duration({
                hours: offset.hours(),
                minutes: offset.minutes()
            }).asMinutes();
        };
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
                        var expirationOffset = _this.getOffset(reward.expiration), countdownOffset = _this.getOffset(reward.countdown);
                        var expiration = dateTime.clone()
                            .seconds(0)
                            .minutes(expirationOffset *
                            Math.ceil((dateTime.minutes() + countdownOffset) /
                                expirationOffset));
                        var countdown = expiration
                            .clone()
                            .subtract({ minutes: countdownOffset });
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
}());
module.exports = GenericASCIIM1;
