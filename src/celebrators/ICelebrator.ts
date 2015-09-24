/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');

import AbstractOption = require('../options/AbstractOption');

/**
 * Check option result and get reward
 */
interface ICelebrator<Option extends AbstractOption> {
    getGain(option: Option): Q.Promise<number>;
}

export = ICelebrator;