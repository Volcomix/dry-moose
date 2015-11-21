/// <reference path="../../../../../typings/tsd.d.ts" />

interface Margin {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

module Margin {
	export var defaultMargin: Margin = { top: 20, right: 60, bottom: 30, left: 20 };
}

export = Margin;