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
    });
    after(function () {
        // Supervisor close db so reconnect to drop database
        return DbManager.connect('test-Supervisor')
            .then(function () {
            return Q.ninvoke(DbManager.db, 'dropDatabase');
        })
            .then(function () {
            return DbManager.close();
        });
    });
});
