/// <reference path="../../typings/tsd.d.ts" />

import IOption = require('../options/IOption');

/**
 * Buy options
 */
interface IInvestor {
    invest(option: IOption): void;
}

export = IInvestor;