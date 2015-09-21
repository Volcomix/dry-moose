/// <reference path="../../typings/tsd.d.ts" />

import IOption = require('../options/IOption');

interface IInvestor {
    invest(option: IOption): void;
}

export = IInvestor;