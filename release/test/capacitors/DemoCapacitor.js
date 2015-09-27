/// <reference path="../../../typings/tsd.d.ts" />
var chai = require('chai');
var DbManager = require('../../database/DbManager');
var DemoCapacitor = require('../../capacitors/DemoCapacitor');
var should = chai.should();
describe('DemoCapacitor', function () {
    var capacitor = new DemoCapacitor(100);
    describe('#getPortfolio()', function () {
        it('should return 100', function () {
            return capacitor.getPortfolio()
                .then(function (portfolio) {
                portfolio.should.equal(100);
            });
        });
    });
    after(function () {
        return DbManager.db
            .then(function (db) {
            return db.close();
        });
    });
});
