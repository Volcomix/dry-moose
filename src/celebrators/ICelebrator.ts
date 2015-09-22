/// <reference path="../../typings/tsd.d.ts" />

import IOption = require('../options/IOption');

/**
 * Check option result and get reward
 */
interface ICelebrator<Option extends IOption> {
    getReward(option: Option);
}

export = ICelebrator;