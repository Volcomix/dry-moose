/// <reference path="../../../../typings/tsd.d.ts" />

import AppDispatcher = require('../dispatcher/AppDispatcher');
import ActionType = require('../constants/ActionType');
import IAction = require('./IAction');

export function move(mouse: [number, number]) {
	AppDispatcher.dispatch({ actionType: ActionType.MoveCursor, mouse } as Move);
}

export function hide() {
	AppDispatcher.dispatch({ actionType: ActionType.HideCursor });
}

export interface Move extends IAction {
	mouse: [number, number];
}