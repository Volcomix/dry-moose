/// <reference path="../../../../typings/tsd.d.ts" />

import Quote = require('../../../documents/Quote');
import Portfolio = require('../../../documents/Portfolio');

import AbstractStore = require('./AbstractStore');
import IStore = require('./IStore');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import MonitoringServerActions = require('../actions/MonitoringServerActions');
import ActionType = require('../constants/ActionType');
import MonitoringUtils = require('../utils/MonitoringUtils');

class MonitoringStoreImpl extends AbstractStore implements MonitoringStore {
	
	private _startDate: Date;
	private _endDate: Date;
	private _quotes: Quote[];
	private _portfolio: Portfolio[];
	
	get startDate() {
		return this._startDate;
	}
	
	get endDate() {
		return this._endDate;
	}
	
	get quotes() {
		return this._quotes;
	}
	
	get portfolio() {
		return this._portfolio;
	}
	
	constructor() {
		super();
		AppDispatcher.register(action => {
			switch(action.actionType) {
				case ActionType.QuotesReceived:
					var receiveAction = action as MonitoringServerActions.Receive;
					this._startDate = receiveAction.startDate;
					this._endDate = receiveAction.endDate;
					if (receiveAction.quotes.length) {
						this._quotes = receiveAction.quotes;
					}
					if (receiveAction.portfolio.length) {
						this._portfolio = receiveAction.portfolio;
					}
					this.emitChange();
			}
		});
	}
}

interface MonitoringStore extends IStore, MonitoringUtils.MonitoringData {}

var MonitoringStore: MonitoringStore = new MonitoringStoreImpl();

export = MonitoringStore;