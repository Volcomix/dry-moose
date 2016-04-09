import React = require('react');
import d3 = require('d3');

import XCursor = require('./XCursor');

class XAxis extends React.Component<XAxis.Props, {}> {
	
	private axis = d3.svg.axis()
		.tickFormat(d3.time.format.multi([
			['.%L', d => d.getMilliseconds()],
			[':%S', d => d.getSeconds()],
			['%H:%M', d => d.getMinutes()],
			['%H:%M', d => d.getHours()],
			['%a %d', d => d.getDay() && d.getDate() != 1],
			['%b %d', d => d.getDate() != 1],
			['%B', d => d.getMonth()],
			['%Y', d => true]
		]))
		.orient('bottom');
	
	render() {
		this.axis
			.scale(this.props.scale)
			.tickSize(-this.props.height, 0);
		return (
			<g>
				<g
					className='x axis'
					transform={'translate(0, ' + this.props.height + ')'}
					ref={(ref: any) => d3.select(ref).call(this.axis)} />
				<XCursor
					height={this.props.height}
					scale={this.props.scale} />
			</g>
		);
	}
}

module XAxis {
	export interface Props {
		height: number;
		scale: d3.time.Scale<Date, number>;
	}
}

export = XAxis;