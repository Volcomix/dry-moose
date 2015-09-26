/// <reference path="../../typings/tsd.d.ts" />

import mongodb = require('mongodb');
import Q = require('q');
import moment = require('moment');

import DbManager = require('../database/DbManager');
import IProcessor = require('../processors/IProcessor');
import IInvestor = require('../investors/IInvestor');
import ICelebrator = require('../celebrators/ICelebrator');
import ICapacitor = require('../capacitors/ICapacitor');
import Quote = require('../documents/Quote');
import Reward = require('../documents/Reward');
import Option = require('../documents/options/Option');

var MongoClient = mongodb.MongoClient;

/**
 * Collect trading quotes
 */
abstract class AbstractCollector {
	
	abstract collect(): Q.Promise<{}>;
	
	process(quote: Quote, rewards: Reward[]) {
		
	}
}

export = AbstractCollector;