/// <reference path="../../../../typings/tsd.d.ts" />
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionType = require('../constants/ActionType');
function receive(data) {
    AppDispatcher.dispatch({
        actionType: ActionType.QuotesReceived,
        data: data
    });
}
exports.receive = receive;
function receiveLast(data) {
    AppDispatcher.dispatch({
        actionType: ActionType.LastQuotesReceived,
        data: data
    });
}
exports.receiveLast = receiveLast;
