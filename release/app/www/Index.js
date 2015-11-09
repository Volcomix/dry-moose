/// <reference path="../../../typings/tsd.d.ts" />
var React = require('react');
var ReactDOM = require('react-dom');
var WindowActions = require('./actions/WindowActions');
var Chart = require('./components/Chart');
var container = document.getElementById('chart');
function resizeContainer() {
    WindowActions.resize(container.offsetWidth, container.offsetHeight);
}
window.addEventListener('resize', resizeContainer);
resizeContainer();
ReactDOM.render(React.createElement(Chart, null), container);
