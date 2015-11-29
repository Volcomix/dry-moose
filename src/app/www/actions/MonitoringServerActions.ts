/// <reference path="../../../../typings/tsd.d.ts" />

import MonitoringData = require('../../../documents/MonitoringData');

import IAction = require('./IAction');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import ActionType = require('../constants/ActionType');

export function receive(data: MonitoringData) {
	AppDispatcher.dispatch({
		actionType: ActionType.ReceiveQuotes,
		data
	} as Receive);
}

export function receiveFirst(data: MonitoringData) {
	AppDispatcher.dispatch({
		actionType: ActionType.ReceiveFirstQuotes,
		data
	} as Receive);
}

export function receiveLast(data: MonitoringData) {
	AppDispatcher.dispatch({
		actionType: ActionType.ReceiveLastQuotes,
		data
	} as Receive);
}

export interface Receive extends IAction {
	data: MonitoringData;
}