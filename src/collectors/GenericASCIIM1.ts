/// <reference path="../../typings/tsd.d.ts" />

import fs = require('fs');
import readline = require('readline');

import moment = require('moment');

import AbstractCollector = require('./AbstractCollector');
import IProcessor = require('../processors/IProcessor');
import IInvestor = require('../investors/IInvestor');
import ForexQuote = require('../quotes/ForexQuote');
import Reward = require('../options/Reward');
import IOption = require('../options/IOption');

class GenericASCIIM1 extends AbstractCollector {
    
    constructor(
        processor: IProcessor<ForexQuote, IOption>,
        investor: IInvestor,
        private filename: string,
        private rewards: Reward[]
    ){
        super(processor, investor);
    }
    
    collect() {
        var rl = readline.createInterface({
            input: fs.createReadStream(this.filename),
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
            
            var quote = new ForexQuote(dateTime, open, high, low, close, volume);
            
            var rewards: Reward[] = this.rewards.map(function(reward: Reward) {
                return {
                    expiration: moment().add({
                        hours: reward.expiration.hours(),
                        minutes: reward.expiration.minutes()
                    }),
                    payout: reward.payout
                }
            });
            
            var option = this.processor.process(quote, rewards);
            if (option) {
                this.investor.invest(option);
            }
        });
    }
}

export = GenericASCIIM1;