/// <reference path="../../../../typings/tsd.d.ts" />

import events = require('events');

import AppDispatcher = require('../dispatcher/AppDispatcher');
import IAction = require('../actions/IAction');
import ActionType = require('../constants/ActionType');

class WindowStoreImpl extends events.EventEmitter implements WindowStore {
	private static CHANGE_EVENT = 'change';
	
	emitChange() {
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
	emitChange();
	addChangeListener(callback: Function);
	removeChangeListener(callback: Function);
}

var WindowStore: WindowStore = new WindowStoreImpl();

AppDispatcher.register(function(action: IAction) {
	switch(action.actionType) {
		case ActionType.WindowResize:
			break;
	}
});

export = WindowStore;