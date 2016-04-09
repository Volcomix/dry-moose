import chai = require('chai');
import Q = require('q');

import DbManager = require('../../database/DbManager');
import Quote = require('../../documents/Quote');
import DbCollector = require('../../collectors/DbCollector');

var should = chai.should();

describe('DbCollector', function() {
	
	before(function() {
		return DbManager.connect('test-DbCollector');
	});
	
	describe('#collect()', function() {
		
		var quotes: Quote[] = [
			<Quote> { dateTime: new Date('2015-09-27 08:01:00Z'), close: 1 },
			<Quote> { dateTime: new Date('2015-09-27 08:02:00Z'), close: 1.5 },
			<Quote> { dateTime: new Date('2015-09-27 08:03:00Z'), close: 0.5 }
		];
		
		before(function() {
			return Q.ninvoke(DbManager.db.collection('quotes'), 'insertMany', quotes);
		});
		
		it('should not collect quotes when collection not found', function() {
			return new DbCollector('wrong').collect()
			.progress(function(quote: Quote) {
				should.not.exist(quote);
			});
		});
		
		it('should collect quotes', function() {
			var collectedQuotes: Quote[] = [];
			return new DbCollector('quotes').collect()
			.progress(function(quote: Quote) {
				collectedQuotes.push(quote);
			})
			.then(function() {
				collectedQuotes.should.deep.equal(quotes);
			});
		});
	});
	
	after(function() {
		return Q.ninvoke(DbManager.db, 'dropDatabase')
		.then(function() {
			return DbManager.close();
		});
	});
});