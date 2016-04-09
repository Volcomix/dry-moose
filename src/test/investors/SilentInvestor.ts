import SilentInvestor = require('../../investors/SilentInvestor');
import Option = require('../../documents/options/Option');
import Quote = require('../../documents/Quote');
import Reward = require('../../documents/Reward');

describe('SilentInvestor', function() {
	describe('#invest()', function() {
		it('should silently do nothing', function() {
			new SilentInvestor().invest(<Option> {
				quote: <Quote> {
					dateTime: new Date(), open: 1, high: 1, low: 1, close: 1, volume: 0,
					rewards: [ <Reward> {
						countdown: new Date(), expiration: new Date(), payout: 0.75
					} ]
				},
				expiration: new Date(),
				amount: 10
			});
		});
	});
});