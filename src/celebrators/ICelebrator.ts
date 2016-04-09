import Q = require('q');

import Gain = require('../documents/Gain');
import Option = require('../documents/options/Option');

/**
 * Check option result and get reward
 */
interface ICelebrator {
    getGain(option: Option): Q.Promise<Gain>;
}

export = ICelebrator;