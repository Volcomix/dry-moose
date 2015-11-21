/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');
import moment = require('moment');

class XCursor extends React.Component<XCursor.Props, {}> {
	
	private dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
	
	render() {
		var dateTime = this.snapDateTime();
		return (
			<g
				className='x cursor'
				transform={'translate(' + this.props.scale(dateTime) + ', 0)'}>
				<line y2={this.props.height} />
				<rect x={-60} y={this.props.height} width={120} height={14} />
				<text dy='.71em' y={this.props.height + 3}>
					{this.dateFormat(dateTime)}
				</text>
			</g>
		);
	}
	
	private snapDateTime() {
		var domain = this.props.scale.domain(),
			minDateTime = moment(domain[0]).endOf('minute').add({ second: 1 }),
			maxDateTime = moment(domain[1]).startOf('minute'),
			dateTime = moment(this.props.scale.invert(this.props.mouseX));
		
		// Round to closest minute
		dateTime.add({ seconds: 30 }).startOf('minute');
		
		return moment.max(moment.min(dateTime, maxDateTime), minDateTime).toDate();
	}
}

module XCursor {
	export interface Props {
		data: {}[];
		accessor: (d: {}) => Date;
		mouseX: number;
		height: number;
		scale: d3.time.Scale<Date, number>;
		snapThreshold?: number;
	}
	
	export var defaultProps: Props = {
		data: undefined,
		accessor: undefined,
		mouseX: undefined,
		height: undefined,
		scale: undefined,
		snapThreshold: 60000
	}
}

export = XCursor;