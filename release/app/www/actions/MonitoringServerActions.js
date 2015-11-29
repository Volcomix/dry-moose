/// <reference path="../../../../typings/tsd.d.ts" />
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionType = require('../constants/ActionType');
function receive(data) {
    AppDispatcher.dispatch({
        actionType: ActionType.ReceiveQuotes,
        data: data
    });
}
exports.receive = receive;
function receiveFirst(data) {
    AppDispatcher.dispatch({
        actionType: ActionType.ReceiveFirstQuotes,
        data: data
    });
}
exports.receiveFirst = receiveFirst;
function receiveLast(data) {
    AppDispatcher.dispatch({
        actionType: ActionType.ReceiveLastQuotes,
        data: data
    });
}
exports.receiveLast = receiveLast;
