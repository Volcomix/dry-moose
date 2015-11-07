/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');

import XCursor = require('./XCursor');
import YCursor = require('./YCursor');

class Cursor extends React.Component<Cursor.Props, Cursor.State> {
	
	private zoom = d3.behavior.zoom();
	private pane: SVGRectElement;
	
	constructor(props) {
		super(props);
		this.zoom.x(this.props.xScale as any);
		this.state = { position: undefined };
	}
	
	private clearPosition = () => this.setState({ position: undefined});
	private updatePosition = () => this.setState({ position: d3.mouse(this.pane) });
	
	componentDidMount() {
		// Use d3.event to make d3.mouse work
		d3.select(this.pane).on('mousemove', this.updatePosition);
		
		this.zoom.on('zoom', this.props.onZoom);
		d3.select(this.pane).call(this.zoom);
	}
	
	componentWillUnmount() {
		d3.select(this.pane).on('mousemove', null);
		this.zoom.on('zoom', null);
  	}
	
	render() {
		var xCursor: JSX.Element,
			yCursor: JSX.Element;
		
		if (this.state.position) {
			xCursor = (
				<XCursor
					data={this.props.data}
					x={this.state.position[0]}
					height={this.props.height}
					scale={this.props.xScale} />
			);
			yCursor = (
				<YCursor
					y={this.state.position[1]}
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
}

module Cursor {
	export interface Props {
		data: Quote[];
		width: number;
		height: number;
		xScale: d3.time.Scale<Date, number>;
		yScale: d3.scale.Linear<number, number>;
		onZoom?: (d: {}, i: number) => any;
	}
	
	export interface State {
		position: [number, number];
	}
}

export = Cursor;