/// <reference path="../../../../typings/tsd.d.ts" />
var ActionType;
(function (ActionType) {
    ActionType[ActionType["ReceiveQuotes"] = 0] = "ReceiveQuotes";
    ActionType[ActionType["ReceiveFirstQuotes"] = 1] = "ReceiveFirstQuotes";
    ActionType[ActionType["ReceiveLastQuotes"] = 2] = "ReceiveLastQuotes";
    ActionType[ActionType["ReceivePreviousOption"] = 3] = "ReceivePreviousOption";
    ActionType[ActionType["ReceiveNextOption"] = 4] = "ReceiveNextOption";
    ActionType[ActionType["MoveCursor"] = 5] = "MoveCursor";
    ActionType[ActionType["HideCursor"] = 6] = "HideCursor";
})(ActionType || (ActionType = {}));
module.exports = ActionType;
