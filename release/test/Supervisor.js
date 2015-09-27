/// <reference path="../../typings/tsd.d.ts" />
var chai = require('chai');
var Q = require('q');
var moment = require('moment');
var DbManager = require('../database/DbManager');
var Supervisor = require('../Supervisor');
var GenericASCIIM1 = require('../collectors/GenericASCIIM1');
var DummyProcessor = require('../processors/DummyProcessor');
var SilentInvestor = require('../investors/SilentInvestor');
var DemoCelebrator = require('../celebrators/DemoCelebrator');
var DemoCapacitor = require('../capacitors/DemoCapacitor');
var should = chai.should();
describe('Supervisor', function () {
    before(function () {
        return DbManager.connect('test-Supervisor');
    });
    describe('#run()', function () {
        it('should run', function () {
            return new Supervisor(new GenericASCIIM1('src/test/Supervisor.csv', [{
                    countdown: moment({ minutes: 10 }).toDate(),
                    expiration: moment({ minutes: 30 }).toDate(),
                    payout: 0.75
                }]), new DummyProcessor(), new SilentInvestor(), new DemoCelebrator(), new DemoCapacitor(100))
                .run();
        });
        it('should collect quotes', function () {
            // Supervisor close db so reconnect to continue tests
            return DbManager.connect('test-Supervisor')
                .then(function () {
                var cursor = DbManager.db.collection('quotes').find();
                return Q.ninvoke(cursor, 'count');
            })
                .then(function (count) {
                count.should.equal(1439);
            })
                .then(function () {
                var cursor = DbManager.db.collection('quotes')
                    .find({ dateTime: new Date('2015-06-01 12:00:00-0500') });
                return Q.ninvoke(cursor, 'next');
            })
                .then(function (quote) {
                delete quote['_id']; // Generated by MongoDB
                quote.should.deep.equal({
                    dateTime: new Date('2015-06-01 12:00:00-0500'),
                    open: 1.091230, high: 1.091310, low: 1.090950, close: 1.090960,
                    volume: 0,
                    rewards: [{
                            countdown: new Date('2015-06-01 12:20:00-0500'),
                            expiration: new Date('2015-06-01 12:30:00-0500'),
                            payout: 0.75,
                        }]
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