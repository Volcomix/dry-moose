/// <reference path="../../typings/tsd.d.ts" />

import Option = require('../options/Option');

/**
 * Buy options
 */
interface IInvestor {
    invest(option: Option): void;
}

export = IInvestor;