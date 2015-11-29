/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');
import moment = require('moment');

import CursorStore = require('../stores/CursorStore');

class XCursor extends React.Component<XCursor.Props, XCursor.State> {
	
	private dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
	
	private get xCursorState() {
		return { mouseX: CursorStore.mouse && CursorStore.mouse[0] };
	}
	
	constructor(props) {
		super(props);
		this.state = this.xCursorState;
	}
	
	componentDidMount() {
		CursorStore.addChangeListener(this.onChange);
	}
	
	componentWillUnmount() {
		CursorStore.removeChangeListener(this.onChange);
	}
	
	render() {
		if (this.state.mouseX) {
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
		} else {
			return null;
		}
	}
	
	private snapDateTime() {
		var domain = this.props.scale.domain(),
			minDateTime = moment(domain[0]).endOf('minute').add({ second: 1 }),
			maxDateTime = moment(domain[1]).startOf('minute'),
			dateTime = moment(this.props.scale.invert(this.state.mouseX));
		
		// Round to closest minute
		dateTime.add({ seconds: 30 }).startOf('minute');
		
		return moment.max(moment.min(dateTime, maxDateTime), minDateTime).toDate();
	}
	
	private onChange = () => this.setState(this.xCursorState);
}

module XCursor {
	export interface Props {
		height: number;
		scale: d3.time.Scale<Date, number>;
	}
	
	export interface State {
		mouseX: number;
	}
}

export = XCursor;