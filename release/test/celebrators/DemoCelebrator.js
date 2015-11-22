/// <reference path="../../../typings/tsd.d.ts" />
var chai = require('chai');
var Q = require('q');
var DbManager = require('../../database/DbManager');
var DemoCelebrator = require('../../celebrators/DemoCelebrator');
var BinaryOption = require('../../documents/options/BinaryOption');
var should = chai.should();
describe('DemoCelebrator', function () {
    var celebrator = new DemoCelebrator();
    before(function () {
        return DbManager.connect('test-DemoCelebrator');
    });
    describe('#getGain()', function () {
        context('when database empty', function () {
            it('should return no gain', function () {
                return celebrator.getGain({
                    quote: { dateTime: new Date(), close: 1 },
                    expiration: new Date(),
                    amount: 10,
                    payout: 0.75,
                    direction: BinaryOption.Direction.Call
                })
                    .then(function (gain) {
                    gain.value.should.equal(0);
                });
            });
        });
        context('when database contains quotes', function () {
            var quotes = [
                { dateTime: new Date('2015-09-27 08:01:00Z'), close: 1 },
                { dateTime: new Date('2015-09-27 08:02:00Z'), close: 1.5 },
                { dateTime: new Date('2015-09-27 08:03:00Z'), close: 0.5 }
            ];
            before(function () {
                return Q.ninvoke(DbManager.db.collection('quotes'), 'insertMany', quotes);
            });
            it('should return gain for 1st winning option', function () {
                return celebrator.getGain({
                    quote: quotes[0],
                    expiration: quotes[1].dateTime,
                    amount: 10,
                    payout: 0.75,
                    direction: BinaryOption.Direction.Call
                })
                    .then(function (gain) {
                    gain.value.should.equal(17.5);
                });
            });
            it('should return gain for 2nd winning option', function () {
                return celebrator.getGain({
                    quote: quotes[0],
                    expiration: quotes[2].dateTime,
                    amount: 10,
                    payout: 0.75,
                    direction: BinaryOption.Direction.Put
                })
                    .then(function (gain) {
                    gain.value.should.equal(17.5);
                });
            });
            it('should return no gain for 1st loosing option', function () {
                return celebrator.getGain({
                    quote: quotes[0],
                    expiration: quotes[1].dateTime,
                    amount: 10,
                    payout: 0.75,
                    direction: BinaryOption.Direction.Put
                })
                    .then(function (gain) {
                    gain.value.should.equal(0);
                });
            });
            it('should return no gain for 2nd loosing option', function () {
                return celebrator.getGain({
                    quote: quotes[0],
                    expiration: quotes[2].dateTime,
                    amount: 10,
                    payout: 0.75,
                    direction: BinaryOption.Direction.Call
                })
                    .then(function (gain) {
                    gain.value.should.equal(0);
                });
            });
        });
    });
    after(function () {
        return Q.ninvoke(DbManager.db, 'dropDatabase')
            .then(function () {
            return DbManager.close();
        });
    });
});
