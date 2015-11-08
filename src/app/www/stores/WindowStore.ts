/// <reference path="../../../../typings/tsd.d.ts" />

import AbstractStore = require('./AbstractStore');
import IStore = require('./IStore');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import WindowActions = require('../actions/WindowActions');
import ActionType = require('../constants/ActionType');

class WindowStoreImpl extends AbstractStore implements WindowStore {
	private _width: number;
	private _height: number;
	
	get width() {
		return this._width;
	}
	
	get height() {
		return this._height;
	}
	
	constructor() {
		super();
		AppDispatcher.register(action => {
			switch(action.actionType) {
				case ActionType.WindowResize:
					var resizeAction = action as WindowActions.Resize;
					this._width = resizeAction.width;
					this._height = resizeAction.height;
					this.emitChange();
					break;
			}
		});
	}
}

interface WindowStore extends IStore {
	width: number;
	height: number;
}

var WindowStore: WindowStore = new WindowStoreImpl();

export = WindowStore;