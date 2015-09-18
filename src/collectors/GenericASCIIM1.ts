/// <reference path="../../typings/tsd.d.ts" />

import fs = require('fs');
import readline = require('readline');

import moment = require('moment');

import ForexQuote = require('../quotes/ForexQuote');

export function fromFile(filename: string) {
    var rl = readline.createInterface({
        input: fs.createReadStream(filename),
        output: null
    });
    
    rl.on('line', function(line) {
        var arr = line.split(';');
		
		var dateTime = moment(arr[0] + '-0500', 'YYYYMMDD hhmmssZ');
		var open = parseFloat(arr[1]);
		var high = parseFloat(arr[2]);
        var low = parseFloat(arr[3]);
        var close = parseFloat(arr[4]);
        var volume = parseFloat(arr[5]);
		
        var quote = new ForexQuote(dateTime, open, high, low, close, volume);
		
        console.log(quote.dateTime.format() + " => " + quote.close);
    });
}