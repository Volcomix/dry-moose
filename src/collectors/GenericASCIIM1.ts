/// <reference path="../../typings/tsd.d.ts" />

import fs = require('fs');
import readline = require('readline');

import moment = require('moment');

import AbstractCollector = require('./AbstractCollector');
import AbstractProcessor = require('../processors/AbstractProcessor');
import IQuote = require('../quotes/IQuote');
import ForexQuote = require('../quotes/ForexQuote');
import IOption = require('../options/IOption');

class GenericASCIIM1 extends AbstractCollector {
    
    constructor(processor: AbstractProcessor<IQuote, IOption>, private filename: string) {
        super(processor);
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
            
            this.processor.process(quote);
        });
    }
}

export = GenericASCIIM1;