/// <reference path="../../typings/tsd.d.ts" />

import fs = require('fs');
import readline = require('readline');

import Q = require('q');
import moment = require('moment');

import ICollector = require('./ICollector');
import Quote = require('../documents/Quote');
import Reward = require('../documents/Reward');

class GenericASCIIM1 implements ICollector {
    
    constructor(
        private filename: string,
        private rewards: Reward[]
    ){ }
    
    collect(): Q.Promise<{}> {
        return Q.Promise((resolve, reject, notify) => {
            var rs = fs.createReadStream(this.filename);
        
            rs.on('error', reject);
            
            var rl = readline.createInterface({
                input: rs,
                output: null
            });
            
            rl.on('line', (line) => {
                var arr = line.split(';');
                
                var dateTime = moment(arr[0] + '-0500', 'YYYYMMDD hhmmssZ');
                var open = parseFloat(arr[1]);
                var high = parseFloat(arr[2]);
                var low = parseFloat(arr[3]);
                var close = parseFloat(arr[4]);
                var volume = parseFloat(arr[5]);
                
                var quote: Quote = {
                    dateTime: dateTime.toDate(),
                    open: open,
                    high: high,
                    low: low,
                    close: close,
                    volume: volume
                };
                
                var rewards: Reward[] = this.rewards.map<Reward>(function(reward: Reward) {
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
                });
                
                notify({
                    quote: quote,
                    rewards: rewards
                });
            });
            
            rl.on('close', resolve);
        });
    }
}

export = GenericASCIIM1;