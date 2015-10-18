/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');

import Chart = require('./Chart');

ReactDOM.render(<Chart width={800} height={600} />, document.getElementById('chart'));