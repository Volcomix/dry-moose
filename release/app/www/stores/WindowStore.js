/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events = require('events');
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
                    _this.width = resizeAction.width;
                    _this.height = resizeAction.height;
                    _this.emitChange();
                    break;
            }
        });
    }
    WindowStoreImpl.prototype.getWidth = function () {
        return this.width;
    };
    WindowStoreImpl.prototype.getHeight = function () {
        return this.height;
    };
    WindowStoreImpl.prototype.emitChange = function () {
        this.emit(WindowStoreImpl.CHANGE_EVENT);
    };
    WindowStoreImpl.prototype.addChangeListener = function (callback) {
        this.on(WindowStoreImpl.CHANGE_EVENT, callback);
    };
    WindowStoreImpl.prototype.removeChangeListener = function (callback) {
        this.removeListener(WindowStoreImpl.CHANGE_EVENT, callback);
    };
    WindowStoreImpl.CHANGE_EVENT = 'change';
    return WindowStoreImpl;
})(events.EventEmitter);
var WindowStore = new WindowStoreImpl();
module.exports = WindowStore;
