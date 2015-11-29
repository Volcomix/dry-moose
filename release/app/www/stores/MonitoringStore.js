/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var moment = require('moment');
var AbstractStore = require('./AbstractStore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionType = require('../constants/ActionType');
var MonitoringStoreImpl = (function (_super) {
    __extends(MonitoringStoreImpl, _super);
    function MonitoringStoreImpl() {
        var _this = this;
        _super.call(this);
        AppDispatcher.register(function (action) {
            switch (action.actionType) {
                case ActionType.ReceiveQuotes:
                    var receiveAction = action;
                    _this._data = receiveAction.data;
                    _this.emitChange();
                    break;
                case ActionType.ReceiveLastQuotes:
                    var receiveAction = action;
                    _this._data = receiveAction.data;
                    _this.setEndXDomain();
                    _this.emitChange();
                    break;
                case ActionType.ReceiveFirstQuotes:
                    var receiveAction = action;
                    _this._data = receiveAction.data;
                    _this.setStartXDomain();
                    _this.emitChange();
                    break;
            }
        });
    }
    Object.defineProperty(MonitoringStoreImpl.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MonitoringStoreImpl.prototype, "resetXDomain", {
        get: function () {
            var xDomain = this._resetXDomain;
            this._resetXDomain = undefined;
            return xDomain;
        },
        enumerable: true,
        configurable: true
    });
    MonitoringStoreImpl.prototype.setStartXDomain = function () {
        var startDateTime = this._data.startDate, endDateTime = moment(startDateTime).add({ hours: 2 }).toDate();
        this._resetXDomain = [startDateTime, endDateTime];
    };
    MonitoringStoreImpl.prototype.setEndXDomain = function () {
        var endDateTime = this._data.endDate, startDateTime = moment(endDateTime).subtract({ hours: 2 }).toDate();
        this._resetXDomain = [startDateTime, endDateTime];
    };
    return MonitoringStoreImpl;
})(AbstractStore);
var MonitoringStore = new MonitoringStoreImpl();
module.exports = MonitoringStore;
