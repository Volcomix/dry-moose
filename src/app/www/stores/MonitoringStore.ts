import moment = require('moment');

import MonitoringData = require('../../../documents/MonitoringData');

import AbstractStore = require('./AbstractStore');
import IStore = require('./IStore');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import MonitoringServerActions = require('../actions/MonitoringServerActions');
import ActionType = require('../constants/ActionType');

class MonitoringStoreImpl extends AbstractStore implements MonitoringStore {
	
	private _data: MonitoringData;
	private _resetXDomain: Date[];
	
	get data() {
		return this._data;
	}
	
	get resetXDomain() {
		var xDomain = this._resetXDomain;
		this._resetXDomain = undefined;
		return xDomain;
	}
	
	private setStartXDomain() {
		var startDateTime = this._data.startDate,
			endDateTime = moment(startDateTime).add({ hours: 2 }).toDate();
		this._resetXDomain = [startDateTime, endDateTime];
	}
	
	private setEndXDomain() {
		var endDateTime = this._data.endDate,
			startDateTime = moment(endDateTime).subtract({ hours: 2 }).toDate();
		this._resetXDomain = [startDateTime, endDateTime];
	}
    
    private setOptionXDomain(dateTime: Date) {
        this._resetXDomain = [
            moment(dateTime).subtract({ hour: 1 }).toDate(),
            moment(dateTime).add({ hour: 1 }).toDate()
        ]; 
    }
	
	constructor() {
		super();
		AppDispatcher.register(action => {
			switch(action.actionType) {
				
				case ActionType.ReceiveQuotes:
					var receiveAction = action as MonitoringServerActions.Receive;
					this._data = receiveAction.data;
					this.emitChange();
					break;
					
				case ActionType.ReceiveFirstQuotes:
					var receiveAction = action as MonitoringServerActions.Receive;
					this._data = receiveAction.data;
					this.setStartXDomain();
					this.emitChange();
					break;
					
				case ActionType.ReceiveLastQuotes:
					var receiveAction = action as MonitoringServerActions.Receive;
					this._data = receiveAction.data;
					this.setEndXDomain();
					this.emitChange();
					break;
                
                case ActionType.ReceivePreviousOption:
                    var optionAction = action as MonitoringServerActions.ReceiveOption;
                    this._data = optionAction.data;
                    this.setOptionXDomain(optionAction.dateTime)
                    this.emitChange();
                    break;
                
                case ActionType.ReceiveNextOption:
                    var optionAction = action as MonitoringServerActions.ReceiveOption;
                    this._data = optionAction.data;
                    this.setOptionXDomain(optionAction.dateTime)
                    this.emitChange();
                    break;
			}
		});
	}
}

interface MonitoringStore extends IStore {
	data: MonitoringData;
	resetXDomain: Date[];
}

var MonitoringStore: MonitoringStore = new MonitoringStoreImpl();

export = MonitoringStore;