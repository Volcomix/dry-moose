"use strict";
var Q = require('q');
var d3 = require('d3');
var moment = require('moment');
var MonitoringServerActions = require('../actions/MonitoringServerActions');
var delay = Q(null);
var retrieveDateTime;
function retrieveData() {
    if (retrieveDateTime) {
        delay = Q.delay(100).then(retrieveData);
        Q.nfcall(d3.json, '/monitoring/minutes/' + retrieveDateTime.toISOString())
            .then(function (data) {
            restoreDateTimes(data);
            MonitoringServerActions.receive(data);
        });
        retrieveDateTime = undefined;
    }
}
function get(dateTime) {
    retrieveDateTime = dateTime;
    if (!delay.isPending()) {
        retrieveData();
    }
}
exports.get = get;
function getFirst() {
    Q.nfcall(d3.json, '/monitoring/minutes/first')
        .then(function (data) {
        restoreDateTimes(data);
        MonitoringServerActions.receiveFirst(data);
    });
}
exports.getFirst = getFirst;
function getLast() {
    Q.nfcall(d3.json, '/monitoring/minutes/last')
        .then(function (data) {
        restoreDateTimes(data);
        MonitoringServerActions.receiveLast(data);
    });
}
exports.getLast = getLast;
function getPreviousOption(dateTime) {
    Q.nfcall(d3.json, '/monitoring/previous/option/' + dateTime.toISOString())
        .then(function (data) {
        var optionReceiver = new OptionReceiver(dateTime, OptionReceiver.Direction.Previous);
        restoreDateTimes(data, optionReceiver.gainRestorer);
        MonitoringServerActions.receivePreviousOption(data, optionReceiver.optionDateTime);
    });
}
exports.getPreviousOption = getPreviousOption;
function getNextOption(dateTime) {
    Q.nfcall(d3.json, '/monitoring/next/option/' + dateTime.toISOString())
        .then(function (data) {
        var optionReceiver = new OptionReceiver(dateTime, OptionReceiver.Direction.Next);
        restoreDateTimes(data, optionReceiver.gainRestorer);
        MonitoringServerActions.receiveNextOption(data, optionReceiver.optionDateTime);
    });
}
exports.getNextOption = getNextOption;
/**
 * Convert all dateTime fields from string to Date. REST services could not
 * send Date objects.
 * @param data - The received data to convert
 * @param gainRestorer - Function to convert Gain data
 */
function restoreDateTimes(data, gainRestorer) {
    data.startDate = new Date(data.startDate);
    data.endDate = new Date(data.endDate);
    data.quotes.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.macd.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.maCross.fast.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.maCross.slow.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.maCross.cross.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.bband.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.portfolio.forEach(function (d) { return d.dateTime = new Date(d.dateTime); });
    data.gains.forEach(gainRestorer || restoreGainDateTimes);
}
function restoreGainDateTimes(d) {
    d.option.quote.dateTime = new Date(d.option.quote.dateTime);
    d.option.expiration = new Date(d.option.expiration);
    d.quote.dateTime = new Date(d.quote.dateTime);
    d.dateTime = new Date(d.dateTime);
}
var OptionReceiver = (function () {
    function OptionReceiver(dateTime, direction) {
        var _this = this;
        this.direction = direction;
        this.gainRestorer = function (d) {
            restoreGainDateTimes(d);
            switch (_this.direction) {
                case OptionReceiver.Direction.Previous:
                    if (moment(d.option.quote.dateTime).isBefore(_this.dateTime)) {
                        _this._optionDateTime = d.option.quote.dateTime;
                    }
                    break;
                case OptionReceiver.Direction.Next:
                    if (!_this._optionDateTime &&
                        moment(d.option.quote.dateTime).isAfter(_this.dateTime)) {
                        _this._optionDateTime = d.option.quote.dateTime;
                    }
                    break;
            }
        };
        this.dateTime = moment(dateTime);
    }
    Object.defineProperty(OptionReceiver.prototype, "optionDateTime", {
        get: function () {
            return this._optionDateTime;
        },
        enumerable: true,
        configurable: true
    });
    return OptionReceiver;
}());
var OptionReceiver;
(function (OptionReceiver) {
    (function (Direction) {
        Direction[Direction["Previous"] = 0] = "Previous";
        Direction[Direction["Next"] = 1] = "Next";
    })(OptionReceiver.Direction || (OptionReceiver.Direction = {}));
    var Direction = OptionReceiver.Direction;
})(OptionReceiver || (OptionReceiver = {}));
