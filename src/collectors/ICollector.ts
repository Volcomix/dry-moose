import Q = require('q');

/**
 * Collect trading quotes
 */
interface ICollector {
	collect(): Q.Promise<void>;
}

export = ICollector;