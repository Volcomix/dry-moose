interface Reward {
	countdown: Date;
	expiration: Date;
	
	/** Percent 0..1 */
	payout: number;
}

export = Reward;