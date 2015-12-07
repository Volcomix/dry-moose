/// <reference path="../../typings/tsd.d.ts" />

interface MACD {
	dateTime: Date;
	value: number;
	signal: number;
	hist: number;
}

export = MACD;