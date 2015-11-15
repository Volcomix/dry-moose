/// <reference path="../../../../typings/tsd.d.ts" />

import MonitoringData = require('../../../documents/MonitoringData');

import IAction = require('./IAction');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import ActionType = require('../constants/ActionType');

export function receive(data: MonitoringData) {
	AppDispatcher.dispatch({ actionType: ActionType.QuotesReceived, data } as Receive);
}

export interface Receive extends IAction {
	data: MonitoringData;
}