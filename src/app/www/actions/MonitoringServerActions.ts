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

export function receivePreviousOption(data: MonitoringData, dateTime: Date) {
    AppDispatcher.dispatch({
        actionType: ActionType.ReceivePreviousOption,
        data, dateTime
    } as ReceiveOption);
}

export function receiveNextOption(data: MonitoringData, dateTime: Date) {
    AppDispatcher.dispatch({
        actionType: ActionType.ReceiveNextOption,
        data, dateTime
    } as ReceiveOption);
}

export interface Receive extends IAction {
	data: MonitoringData;
}

export interface ReceiveOption extends Receive {
    dateTime: Date;
}