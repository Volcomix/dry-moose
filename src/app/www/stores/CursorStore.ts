/// <reference path="../../../../typings/tsd.d.ts" />

import AbstractStore = require('./AbstractStore');
import IStore = require('./IStore');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import ActionType = require('../constants/ActionType');
import CursorActions = require('../actions/CursorActions');

class CursorStoreImpl extends AbstractStore implements CursorStore {
	
	private _mouse: [number, number];
	
	get mouse() {
		return this._mouse;
	}
	
	constructor() {
		super();
		AppDispatcher.register(action => {
			switch(action.actionType) {
				
				case ActionType.MoveCursor:
					var moveAction = action as CursorActions.Move;
					this._mouse = moveAction.mouse;
					this.emitChange();
					break;
				
				case ActionType.HideCursor:
					this._mouse = undefined;
					this.emitChange();
					break;
			}
		});
	}
}

interface CursorStore extends IStore {
	mouse: [number, number];
}

var CursorStore: CursorStore = new CursorStoreImpl();

export = CursorStore;