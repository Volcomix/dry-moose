/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');

import Chart = require('./Chart');
import Resizer = require('./Resizer');

ReactDOM.render(<Resizer><Chart /></Resizer>, document.getElementById('chart'));