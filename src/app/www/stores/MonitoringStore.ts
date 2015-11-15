/// <reference path="../../../../typings/tsd.d.ts" />

import MonitoringData = require('../../../documents/MonitoringData');

import AbstractStore = require('./AbstractStore');
import IStore = require('./IStore');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import MonitoringServerActions = require('../actions/MonitoringServerActions');
import ActionType = require('../constants/ActionType');

class MonitoringStoreImpl extends AbstractStore implements MonitoringStore {
	
	private _data: MonitoringData;
	
	get data() {
		return this._data;
	}
	
	constructor() {
		super();
		AppDispatcher.register(action => {
			switch(action.actionType) {
				case ActionType.QuotesReceived:
					var receiveAction = action as MonitoringServerActions.Receive;
					this._data = receiveAction.data;
					this.emitChange();
			}
		});
	}
}

interface MonitoringStore extends IStore {
	data: MonitoringData;
}

var MonitoringStore: MonitoringStore = new MonitoringStoreImpl();

export = MonitoringStore;