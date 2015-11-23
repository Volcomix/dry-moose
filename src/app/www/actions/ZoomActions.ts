/// <reference path="../../../../typings/tsd.d.ts" />

import AppDispatcher = require('../dispatcher/AppDispatcher');
import ActionType = require('../constants/ActionType');

export function zoom() {
	AppDispatcher.dispatch({ actionType: ActionType.Zoom });
}