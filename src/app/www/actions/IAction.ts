/// <reference path="../../../../typings/tsd.d.ts" />

import ActionType = require('../constants/ActionType')

interface IAction {
	actionType: ActionType;
}

export = IAction;