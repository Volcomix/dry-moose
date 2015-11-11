/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

class XCursor extends React.Component<XCursor.Props, XCursor.State> {
	
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
		var bisect = d3.bisector(this.props.accessor).left,
			x0 = this.props.scale.invert(this.props.mouseX),
            i = bisect(this.props.data, x0, 1),
            d0 = this.props.data[i - 1],
            d1 = this.props.data[i],
            d: {};
			
		if (d1) {
			var domain = this.props.scale.domain();
			if (this.props.accessor(d1) > domain[1]) {
				d = d0;
			} else if (this.props.accessor(d0) < domain[0]) {
				d = d1;
			} else if (+x0 - +this.props.accessor(d0) > +this.props.accessor(d1) - +x0) {
				d = d1;
			} else {
				d = d0;
			}
		} else {
			d = d0;
		}
		
		if (Math.abs(+this.props.accessor(d) - +x0) > this.props.snapThreshold) {
			return x0;
		}
		
		return this.props.accessor(d);
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
	
	export interface State {
	}
}

export = XCursor;