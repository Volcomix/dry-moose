/// <reference path="../../../../typings/tsd.d.ts" />

import _ = require('lodash');

import Quote = require('../../../documents/Quote');
import Portfolio = require('../../../documents/Portfolio');
import MonitoringData = require('../../../documents/MonitoringData');

import IAction = require('./IAction');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import ActionType = require('../constants/ActionType');

export function receive(data: MonitoringData) {
	AppDispatcher.dispatch(
		_.assign<IAction, MonitoringData, Receive>(
			{ actionType: ActionType.QuotesReceived }, data
		)
	);
}

export interface Receive extends IAction, MonitoringData {}