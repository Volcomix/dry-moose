/// <reference path="../../../../typings/tsd.d.ts" />
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionType = require('../constants/ActionType');
function resize(width, height) {
    AppDispatcher.dispatch({
        actionType: ActionType.WindowResize,
        width: width,
        height: height
    });
}
exports.resize = resize;
