import chai = require('chai');
import moment = require('moment');

import NeverProcessor = require('../../processors/NeverProcessor');
import Quote = require('../../documents/Quote');
import Reward = require('../../documents/Reward');

var should = chai.should();

describe('NeverProcessor', function() {
	describe('#process()', function() {
		it('should return no option', function() {
        
			var rewards: Reward[] = [{
				countdown: moment('2015-06-01 00:50:00-0500').toDate(),
				expiration: moment('2015-06-01 01:00:00-0500').toDate(),
				payout: 0.75
			}];
			
            var quote: Quote = {
                dateTime: moment('2015-06-01 00:03:00-0500').toDate(),
                open: 1, high: 1, low: 1, close: 1, volume: 0, rewards: rewards
            };
			
            should.not.exist(new NeverProcessor().process(100, quote, false));
		})
	});
});