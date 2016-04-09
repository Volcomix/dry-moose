"use strict";
var SilentInvestor = require('../../investors/SilentInvestor');
describe('SilentInvestor', function () {
    describe('#invest()', function () {
        it('should silently do nothing', function () {
            new SilentInvestor().invest({
                quote: {
                    dateTime: new Date(), open: 1, high: 1, low: 1, close: 1, volume: 0,
                    rewards: [{
                            countdown: new Date(), expiration: new Date(), payout: 0.75
                        }]
                },
                expiration: new Date(),
                amount: 10
            });
        });
    });
});
