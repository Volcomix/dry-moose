"use strict";
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionType = require('../constants/ActionType');
function move(mouse) {
    AppDispatcher.dispatch({ actionType: ActionType.MoveCursor, mouse: mouse });
}
exports.move = move;
function hide() {
    AppDispatcher.dispatch({ actionType: ActionType.HideCursor });
}
exports.hide = hide;
