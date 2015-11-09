/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');

class XCursor extends React.Component<XCursor.Props, XCursor.State> {
	
	private dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
	
	render() {
		var quote = this.bisectQuote();
		return (
			<g
				className='x cursor'
				transform={'translate(' + this.props.scale(quote.dateTime) + ', 0)'}>
				<line y2={this.props.height} />
				<rect x={-60} y={this.props.height} width={120} height={14} />
				<text dy='.71em' y={this.props.height + 3}>
					{this.dateFormat(quote.dateTime)}
				</text>
			</g>
		);
	}
	
	private bisectQuote() {
		var x0 = this.props.scale.invert(this.props.x),
            i = Quote.bisect(this.props.data, x0, 1),
            d0 = this.props.data[i - 1],
            d1 = this.props.data[i],
            quote: Quote;
			
		if (d1) {
			quote = +x0 - +d0.dateTime > +d1.dateTime - +x0 ? d1 : d0;
		} else {
			quote = d0;
		}
		
		return quote;
	}
}

module XCursor {
	export interface Props {
		data: Quote[];
		x: number;
		height: number;
		scale: d3.time.Scale<Date, number>;
	}
	
	export interface State {
	}
}

export = XCursor;