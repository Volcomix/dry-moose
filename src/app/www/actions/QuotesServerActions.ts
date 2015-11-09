/// <reference path="../../../../typings/tsd.d.ts" />

import Quote = require('../../../documents/Quote');

import IAction = require('./IAction');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import ActionType = require('../constants/ActionType');

export function receive(data: Quote[]) {
	AppDispatcher.dispatch({
		actionType: ActionType.QuotesReceived,
		data: data
	} as Receive)
}

export interface Receive extends IAction {
	data: Quote[];
}