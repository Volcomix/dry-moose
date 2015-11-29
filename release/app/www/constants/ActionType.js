/// <reference path="../../../../typings/tsd.d.ts" />
var ActionType;
(function (ActionType) {
    ActionType[ActionType["ReceiveQuotes"] = 0] = "ReceiveQuotes";
    ActionType[ActionType["ReceiveFirstQuotes"] = 1] = "ReceiveFirstQuotes";
    ActionType[ActionType["ReceiveLastQuotes"] = 2] = "ReceiveLastQuotes";
    ActionType[ActionType["MoveCursor"] = 3] = "MoveCursor";
    ActionType[ActionType["HideCursor"] = 4] = "HideCursor";
})(ActionType || (ActionType = {}));
module.exports = ActionType;
