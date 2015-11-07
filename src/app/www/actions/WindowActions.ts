/// <reference path="../../../../typings/tsd.d.ts" />

import AppDispatcher = require('../dispatcher/AppDispatcher');
import IAction = require('./IAction');
import ActionType = require('../constants/ActionType');

export function resize(width: number, height: number) {
	AppDispatcher.dispatch({
		actionType: ActionType.WindowResize,
		width: width,
		height: height
	} as Resize);
}

export interface Resize extends IAction {
	width: number;
	height: number;
}