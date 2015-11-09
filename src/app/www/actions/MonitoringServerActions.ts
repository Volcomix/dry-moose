/// <reference path="../../../../typings/tsd.d.ts" />

import Quote = require('../../../documents/Quote');
import Portfolio = require('../../../documents/Portfolio');

import IAction = require('./IAction');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import ActionType = require('../constants/ActionType');

export function receive(data: { quotes: Quote[], portfolio: Portfolio[] }) {
	AppDispatcher.dispatch({
		actionType: ActionType.QuotesReceived,
		quotes: data.quotes,
		portfolio: data.portfolio
	} as Receive)
}

export interface Receive extends IAction {
	quotes: Quote[];
	portfolio: Portfolio[];
}