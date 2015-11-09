/// <reference path="../../../../typings/tsd.d.ts" />

import Quote = require('../../../documents/Quote');

import AbstractStore = require('./AbstractStore');
import IStore = require('./IStore');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import MonitoringServerActions = require('../actions/MonitoringServerActions');
import ActionType = require('../constants/ActionType');

class MonitoringStoreImpl extends AbstractStore implements MonitoringStore {
	
	private _data: Quote[];
	
	get data() {
		return this._data;
	}
	
	constructor() {
		super();
		AppDispatcher.register(action => {
			switch(action.actionType) {
				case ActionType.QuotesReceived:
					var quotesReceivedAction = action as MonitoringServerActions.Receive;
					if (quotesReceivedAction.data && quotesReceivedAction.data.length) {
						this._data = quotesReceivedAction.data;
						this.emitChange();
					}
			}
		});
	}
}

interface MonitoringStore extends IStore {
	data: Quote[];
}

var MonitoringStore: MonitoringStore = new MonitoringStoreImpl();

export = MonitoringStore;