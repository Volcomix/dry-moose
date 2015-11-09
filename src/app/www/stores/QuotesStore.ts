/// <reference path="../../../../typings/tsd.d.ts" />

import Quote = require('../../../documents/Quote');

import AbstractStore = require('./AbstractStore');
import IStore = require('./IStore');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import QuotesServerActions = require('../actions/QuotesServerActions');
import ActionType = require('../constants/ActionType');

class QuotesStoreImpl extends AbstractStore implements QuotesStore {
	
	private _data: Quote[];
	
	get data() {
		return this._data;
	}
	
	constructor() {
		super();
		AppDispatcher.register(action => {
			switch(action.actionType) {
				case ActionType.QuotesReceived:
					var quotesReceivedAction = action as QuotesServerActions.Receive;
					if (quotesReceivedAction.data && quotesReceivedAction.data.length) {
						this._data = quotesReceivedAction.data;
						this.emitChange();
					}
			}
		});
	}
}

interface QuotesStore extends IStore {
	data: Quote[];
}

var QuotesStore: QuotesStore = new QuotesStoreImpl();

export = QuotesStore;