/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');

import Option = require('../documents/Option');

/**
 * Check option result and get reward
 */
interface ICelebrator {
    getGain(option: Option): Q.Promise<number>;
}

export = ICelebrator;