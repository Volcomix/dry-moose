import Reward = require('./Reward');

interface Quote {
    dateTime: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    rewards: Reward[];
}

export = Quote;