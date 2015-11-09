/// <reference path="../../../../typings/tsd.d.ts" />
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionType = require('../constants/ActionType');
function receive(data) {
    AppDispatcher.dispatch({
        actionType: ActionType.QuotesReceived,
        quotes: data.quotes,
        portfolio: data.portfolio
    });
}
exports.receive = receive;
