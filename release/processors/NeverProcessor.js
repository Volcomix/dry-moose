/// <reference path="../../typings/tsd.d.ts" />
/**
 * Never ask for any option
 */
var NeverProcessor = (function () {
    function NeverProcessor() {
    }
    NeverProcessor.prototype.process = function (portfolio, quote, isPendingOption) {
        return null;
    };
    return NeverProcessor;
})();
module.exports = NeverProcessor;
