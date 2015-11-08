/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events = require('events');
var AbstractStore = (function (_super) {
    __extends(AbstractStore, _super);
    function AbstractStore() {
        _super.apply(this, arguments);
    }
    AbstractStore.prototype.emitChange = function () {
        this.emit(AbstractStore.CHANGE_EVENT);
    };
    AbstractStore.prototype.addChangeListener = function (callback) {
        this.on(AbstractStore.CHANGE_EVENT, callback);
    };
    AbstractStore.prototype.removeChangeListener = function (callback) {
        this.removeListener(AbstractStore.CHANGE_EVENT, callback);
    };
    AbstractStore.CHANGE_EVENT = 'change';
    return AbstractStore;
})(events.EventEmitter);
module.exports = AbstractStore;
