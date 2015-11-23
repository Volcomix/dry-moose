/// <reference path="../../../../typings/tsd.d.ts" />
var ActionType;
(function (ActionType) {
    ActionType[ActionType["QuotesReceived"] = 0] = "QuotesReceived";
    ActionType[ActionType["FirstQuotesReceived"] = 1] = "FirstQuotesReceived";
    ActionType[ActionType["LastQuotesReceived"] = 2] = "LastQuotesReceived";
    ActionType[ActionType["Zoom"] = 3] = "Zoom";
})(ActionType || (ActionType = {}));
module.exports = ActionType;
