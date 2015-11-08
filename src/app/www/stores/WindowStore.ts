/// <reference path="../../../../typings/tsd.d.ts" />

import events = require('events');

import AppDispatcher = require('../dispatcher/AppDispatcher');
import WindowActions = require('../actions/WindowActions');
import ActionType = require('../constants/ActionType');

class WindowStoreImpl extends events.EventEmitter implements WindowStore {
	private static CHANGE_EVENT = 'change';
	
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
	
	private emitChange() {
		this.emit(WindowStoreImpl.CHANGE_EVENT);
	}
	
	addChangeListener(callback: Function) {
		this.on(WindowStoreImpl.CHANGE_EVENT, callback);
	}
	
	removeChangeListener(callback: Function) {
		this.removeListener(WindowStoreImpl.CHANGE_EVENT, callback);
	}
}

interface WindowStore {
	width: number;
	height: number;
	addChangeListener(callback: Function);
	removeChangeListener(callback: Function);
}

var WindowStore: WindowStore = new WindowStoreImpl();

export = WindowStore;