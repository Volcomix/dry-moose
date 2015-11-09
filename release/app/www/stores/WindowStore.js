/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractStore = require('./AbstractStore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionType = require('../constants/ActionType');
var WindowStoreImpl = (function (_super) {
    __extends(WindowStoreImpl, _super);
    function WindowStoreImpl() {
        var _this = this;
        _super.call(this);
        AppDispatcher.register(function (action) {
            switch (action.actionType) {
                case ActionType.WindowResize:
                    var resizeAction = action;
                    _this._width = resizeAction.width;
                    _this._height = resizeAction.height;
                    _this.emitChange();
                    break;
            }
        });
    }
    Object.defineProperty(WindowStoreImpl.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WindowStoreImpl.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    return WindowStoreImpl;
})(AbstractStore);
var WindowStore = new WindowStoreImpl();
module.exports = WindowStore;