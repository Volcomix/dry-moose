/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');

import MonitoringActions = require('../actions/MonitoringActions');

import Button = require('./Button');

class ChartControls extends React.Component<{}, {}> {
	render() {
		return (
			<div className='chart-controls'>
				<Button onClick={this.goLast}>
					<i className="material-icons">skip_next</i>
				</Button>
			</div>
		);
	}
	
	private goLast() {
		MonitoringActions.getLast();
	}
}

export = ChartControls;