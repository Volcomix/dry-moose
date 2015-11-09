/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');

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
		var x0 = this.props.scale.invert(this.props.x),
            i = Quote.bisect(this.props.data, x0, 1),
            d0 = this.props.data[i - 1],
            d1 = this.props.data[i],
            quote: Quote;
			
		if (d1) {
			var domain = this.props.scale.domain();
			if (d1.dateTime > domain[1]) {
				quote = d0;
			} else if (d0.dateTime < domain[0]) {
				quote = d1;
			} else {
				quote = +x0 - +d0.dateTime > +d1.dateTime - +x0 ? d1 : d0;
			}
		} else {
			quote = d0;
		}
		
		if (Math.abs(+quote.dateTime - +x0) > this.props.snapThreshold) {
			return x0;
		}
		
		return quote.dateTime;
	}
}

module XCursor {
	export interface Props {
		data: Quote[];
		x: number;
		height: number;
		scale: d3.time.Scale<Date, number>;
		snapThreshold: number;
	}
	
	export var defaultProps: Props = {
		data: undefined,
		x: undefined,
		height: undefined,
		scale: undefined,
		snapThreshold: 60000
	}
	
	export interface State {
	}
}

export = XCursor;