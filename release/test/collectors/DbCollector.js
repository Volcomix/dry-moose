"use strict";
var chai = require('chai');
var Q = require('q');
var DbManager = require('../../database/DbManager');
var DbCollector = require('../../collectors/DbCollector');
var should = chai.should();
describe('DbCollector', function () {
    before(function () {
        return DbManager.connect('test-DbCollector');
    });
    describe('#collect()', function () {
        var quotes = [
            { dateTime: new Date('2015-09-27 08:01:00Z'), close: 1 },
            { dateTime: new Date('2015-09-27 08:02:00Z'), close: 1.5 },
            { dateTime: new Date('2015-09-27 08:03:00Z'), close: 0.5 }
        ];
        before(function () {
            return Q.ninvoke(DbManager.db.collection('quotes'), 'insertMany', quotes);
        });
        it('should not collect quotes when collection not found', function () {
            return new DbCollector('wrong').collect()
                .progress(function (quote) {
                should.not.exist(quote);
            });
        });
        it('should collect quotes', function () {
            var collectedQuotes = [];
            return new DbCollector('quotes').collect()
                .progress(function (quote) {
                collectedQuotes.push(quote);
            })
                .then(function () {
                collectedQuotes.should.deep.equal(quotes);
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
