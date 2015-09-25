/// <reference path="../../typings/tsd.d.ts" />

import Option = require('../documents/Option');

/**
 * Buy options
 */
interface IInvestor {
    invest(option: Option): void;
}

export = IInvestor;