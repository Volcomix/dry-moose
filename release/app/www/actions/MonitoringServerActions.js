/// <reference path="../../../../typings/tsd.d.ts" />
var _ = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionType = require('../constants/ActionType');
function receive(data) {
    AppDispatcher.dispatch(_.assign({ actionType: ActionType.QuotesReceived }, data));
}
exports.receive = receive;
