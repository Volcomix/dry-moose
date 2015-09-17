import fs = require('fs');

import Q = require('q');

import ForexQuote = require('ForexQuote');

export function fromFile(filename: string): Q.Promise<ForexQuote[]> {
	return Q.nfcall(fs.readFile, filename)
	.then(function(data) {
		var quotes: ForexQuote[] = [];
		
		console.log('' + data);
		
		return quotes;
	});
}