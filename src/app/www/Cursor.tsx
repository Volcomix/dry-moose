/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../documents/Quote');

import XCursor = require('./XCursor');
import YCursor = require('./YCursor');

class Cursor extends React.Component<Cursor.Props, Cursor.State> {
	render() {		
		return (
			<g>
				<XCursor
					data={this.props.data}
					x={this.props.x}
					height={this.props.height}
					scale={this.props.xScale} />
				<YCursor
					y={this.props.y}
					width={this.props.width}
					scale={this.props.yScale} />
				<rect
					className='pane'
					width={this.props.width}
					height={this.props.height} />
			</g>
		);
	}
}

module Cursor {
	export interface Props {
		data: Quote[];
		x?: number;
		y?: number;
		width: number;
		height: number;
		xScale: d3.time.Scale<Date, number>;
		yScale: d3.scale.Linear<number, number>;
	}
	
	export var defaultProps: Props = {
		data: undefined,
		x: 200,
		y: 200,
		width: undefined,
		height: undefined,
		xScale: undefined,
		yScale: undefined
	}
	
	export interface State {
	}
}

export = Cursor;