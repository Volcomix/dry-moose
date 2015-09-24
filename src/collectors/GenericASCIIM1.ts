/// <reference path="../../typings/tsd.d.ts" />

import fs = require('fs');
import readline = require('readline');

import Q = require('q');
import moment = require('moment');

import AbstractCollector = require('./AbstractCollector');
import IProcessor = require('../processors/IProcessor');
import IInvestor = require('../investors/IInvestor');
import ICelebrator = require('../celebrators/ICelebrator');
import Quote = require('../quotes/Quote');
import Reward = require('../options/Reward');
import AbstractOption = require('../options/AbstractOption');

class GenericASCIIM1 extends AbstractCollector {
    
    constructor(
        processor: IProcessor<AbstractOption>,
        investor: IInvestor,
        celebrator: ICelebrator<AbstractOption>,
        private filename: string,
        private rewards: Reward[]
    ){
        super(processor, investor, celebrator);
    }
    
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
                
                var quote = new Quote(dateTime, open, high, low, close, volume);
                
                var rewards: Reward[] = this.rewards.map(function(reward: Reward) {
                    var m = reward.expiration.minutes();
                    
                    var expiration = dateTime.clone()
                    .set('minutes', m * Math.ceil(dateTime.minutes() / m))
                    .set('seconds', 0)
                    .add({ hours: reward.expiration.hours(), minutes: m });
                    
                    var countdown = expiration.clone()
                    .subtract({
                        hours: reward.countdown.hours(),
                        minutes: reward.countdown.minutes()
                    });
                    
                    return new Reward(countdown, expiration, reward.payout);
                });
                
                this.process(quote, rewards);
            });
            
            rl.on('close', resolve);
        });
    }
}

export = GenericASCIIM1;