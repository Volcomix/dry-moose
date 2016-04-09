import fs = require('fs');
import readline = require('readline');

import Q = require('q');
import moment = require('moment');

import ICollector = require('./ICollector');
import Quote = require('../documents/Quote');
import Reward = require('../documents/Reward');

class GenericASCIIM1 implements ICollector {
    
    constructor(private filename: string, private rewards: Reward[]) { }
    
    collect(): Q.Promise<void> {
        return Q.Promise<void>((resolve, reject, notify) => {
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
                    volume: volume,
                    rewards: this.rewards.map<Reward>((reward: Reward) => {
                        
                        var expirationOffset = this.getOffset(reward.expiration),
                            countdownOffset = this.getOffset(reward.countdown);
                        
                        var expiration = dateTime.clone()
                        .seconds(0)
                        .minutes(
                            expirationOffset *
                            Math.ceil(
                                (dateTime.minutes() + countdownOffset) /
                                expirationOffset
                            )
                        );
                        
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
    }
    
    private getOffset = (date: Date) => {
        var offset = moment(date);
        return moment.duration({
            hours: offset.hours(),
            minutes: offset.minutes()
        }).asMinutes();
    }
}

export = GenericASCIIM1;