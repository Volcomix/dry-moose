/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractStore = require('./AbstractStore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionType = require('../constants/ActionType');
var QuotesStoreImpl = (function (_super) {
    __extends(QuotesStoreImpl, _super);
    function QuotesStoreImpl() {
        var _this = this;
        _super.call(this);
        AppDispatcher.register(function (action) {
            switch (action.actionType) {
                case ActionType.QuotesReceived:
                    var quotesReceivedAction = action;
                    _this._data = quotesReceivedAction.data;
                    _this.emitChange();
            }
        });
    }
    Object.defineProperty(QuotesStoreImpl.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    return QuotesStoreImpl;
})(AbstractStore);
var QuotesStore = new QuotesStoreImpl();
module.exports = QuotesStore;
