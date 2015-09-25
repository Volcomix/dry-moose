/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');

/**
 * Check the portfolio to know how much money remains
 */
interface ICapacitor {
    getPortfolio(): Q.Promise<number>;
}

export = ICapacitor;