/// <reference path="../../../../typings/tsd.d.ts" />
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionType = require('../constants/ActionType');
function zoom() {
    AppDispatcher.dispatch({ actionType: ActionType.Zoom });
}
exports.zoom = zoom;
