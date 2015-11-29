/// <reference path="../../../../typings/tsd.d.ts" />

enum ActionType {
	ReceiveQuotes,
	ReceiveFirstQuotes,
	ReceiveLastQuotes,
	MoveCursor,
	HideCursor
}

export = ActionType;