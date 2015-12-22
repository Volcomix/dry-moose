/// <reference path="../../../../typings/tsd.d.ts" />

enum ActionType {
	ReceiveQuotes,
	ReceiveFirstQuotes,
	ReceiveLastQuotes,
    ReceivePreviousOption,
    ReceiveNextOption,
	MoveCursor,
	HideCursor
}

export = ActionType;