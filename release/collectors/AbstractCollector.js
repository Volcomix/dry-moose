/// <reference path="../../typings/tsd.d.ts" />
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
/**
 * Collect trading quotes
 */
var AbstractCollector = (function () {
    function AbstractCollector() {
    }
    AbstractCollector.prototype.process = function (quote, rewards) {
    };
    return AbstractCollector;
})();
module.exports = AbstractCollector;
