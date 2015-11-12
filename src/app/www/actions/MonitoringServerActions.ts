/// <reference path="../../../../typings/tsd.d.ts" />

import _ = require('lodash');

import Quote = require('../../../documents/Quote');
import Portfolio = require('../../../documents/Portfolio');

import IAction = require('./IAction');
import AppDispatcher = require('../dispatcher/AppDispatcher');
import ActionType = require('../constants/ActionType');
import MonitoringUtils = require('../utils/MonitoringUtils');

export function receive(data: MonitoringUtils.MonitoringData) {
	AppDispatcher.dispatch(
		_.assign<{}, IAction, MonitoringUtils.MonitoringData, {}, Receive>(
			{ actionType: ActionType.QuotesReceived },
			data
		)
	);
}

export interface Receive extends IAction, MonitoringUtils.MonitoringData {}