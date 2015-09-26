/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');

/**
 * Collect trading quotes
 */
interface ICollector {
	collect(): Q.Promise<any>;
}

export = ICollector;