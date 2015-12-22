/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');
import moment = require('moment');

import MonitoringActions = require('../actions/MonitoringActions');

import Button = require('./Button');

class ChartControls extends React.Component<ChartControls.Props, {}> {
    
    private get xDomainCenter(): Date {
        var domain = this.props.xScale.domain(),
            start = moment(domain[0]),
            end = moment(domain[1]),
            diff = end.diff(start, 'minutes');
        
        return start.add({ minutes: diff / 2 }).toDate();
    }
    
	render() {
		return (
			<div className='chart-controls'>
				<Button onClick={this.goToStart}>
					<i className='material-icons'>skip_previous</i>
				</Button>
                <div>
                    <Button onClick={this.goToPreviousOption}>
                        <i className='material-icons'>fast_rewind</i>
                    </Button>
                    <Button onClick={this.goToNextOption}>
                        <i className='material-icons'>fast_forward</i>
                    </Button>
                </div>
				<Button onClick={this.goToEnd}>
					<i className='material-icons'>skip_next</i>
				</Button>
			</div>
		);
	}
	
	private goToStart = () =>
        MonitoringActions.getFirst();
    
	private goToEnd = () =>
        MonitoringActions.getLast();
    
    private goToPreviousOption = () =>
        MonitoringActions.getPreviousOption(this.xDomainCenter);
    
    private goToNextOption = () =>
        MonitoringActions.getNextOption(this.xDomainCenter);
}

module ChartControls {
    export interface Props {
        xScale: d3.time.Scale<Date, number>;
    }
}

export = ChartControls;