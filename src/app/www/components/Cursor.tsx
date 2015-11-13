/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import XCursor = require('./XCursor');
import YCursor = require('./YCursor');

class Cursor extends React.Component<Cursor.Props, Cursor.State> {
	
	private pane: SVGRectElement;
	
	constructor(props) {
		super(props);
		this.state = { mouse: undefined };
	}
	
	componentDidMount() {
		// Use d3.event to make d3.mouse work
		var pane = d3.select(this.pane);
		pane.on('mousemove', this.updatePosition);
		pane.call(this.props.zoom);
	}
	
	componentWillUnmount() {
		d3.select(this.pane).on('mousemove', null);
  	}
	
	render() {
		var xCursor: JSX.Element,
			yCursor: JSX.Element;
		
		if (this.state.mouse) {
			xCursor = (
				<XCursor
					data={this.props.data}
					accessor={this.props.xAccessor}
					mouseX={this.state.mouse[0]}
					height={this.props.height}
					scale={this.props.xScale} />
			);
			yCursor = (
				<YCursor
					mouseY={this.state.mouse[1]}
					width={this.props.width}
					scale={this.props.yScale} />
			);
		}
		
		return (
			<g>
				{xCursor}
				{yCursor}
				<rect
					className='pane'
					ref={(pane: any) => this.pane = pane}
					width={this.props.width}
					height={this.props.height}
					onMouseOut={this.clearPosition} />
			</g>
		);
	}
	
	private clearPosition = () => this.setState({ mouse: undefined});
	private updatePosition = () => this.setState({ mouse: d3.mouse(this.pane) });
}

module Cursor {
	export interface Props {
		data: {}[];
		xAccessor: (d: {}) => Date;
		width: number;
		height: number;
		xScale: d3.time.Scale<Date, number>;
		yScale: d3.scale.Linear<number, number>;
		zoom: d3.behavior.Zoom<{}>;
	}
	
	export var defaultProps: Props = {
		data: undefined,
		xAccessor: undefined,
		width: undefined,
		height: undefined,
		xScale: undefined,
		yScale: undefined,
		zoom: undefined
	}
	
	export interface State {
		mouse: [number, number];
	}
}

export = Cursor;