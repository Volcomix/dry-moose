/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');

import WindowActions = require('./actions/WindowActions');

import Chart = require('./components/Chart');

var container = document.getElementById('chart');

function resizeContainer() {
	WindowActions.resize(container.offsetWidth, container.offsetHeight);
}
window.addEventListener('resize', resizeContainer);
resizeContainer();

ReactDOM.render(<Chart />, container);