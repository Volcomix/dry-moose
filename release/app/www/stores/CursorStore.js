/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractStore = require('./AbstractStore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionType = require('../constants/ActionType');
var CursorStoreImpl = (function (_super) {
    __extends(CursorStoreImpl, _super);
    function CursorStoreImpl() {
        var _this = this;
        _super.call(this);
        AppDispatcher.register(function (action) {
            switch (action.actionType) {
                case ActionType.MoveCursor:
                    var moveAction = action;
                    _this._mouse = moveAction.mouse;
                    _this.emitChange();
                    break;
                case ActionType.HideCursor:
                    _this._mouse = undefined;
                    _this.emitChange();
                    break;
            }
        });
    }
    Object.defineProperty(CursorStoreImpl.prototype, "mouse", {
        get: function () {
            return this._mouse;
        },
        enumerable: true,
        configurable: true
    });
    return CursorStoreImpl;
})(AbstractStore);
var CursorStore = new CursorStoreImpl();
module.exports = CursorStore;
