/// <reference path="../../typings/tsd.d.ts" />

import AbstractOption = require('../options/AbstractOption');

/**
 * Buy options
 */
interface IInvestor {
    invest(option: AbstractOption): void;
}

export = IInvestor;