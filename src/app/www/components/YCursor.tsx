/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import CursorActions = require('../actions/CursorActions');

class YCursor extends React.Component<YCursor.Props, YCursor.State> {
		
	private pane: SVGElement;
	
	private get label() {
		var yValue = this.props.scale.invert(this.state.mouseY);
		return this.props.labelFormat(yValue);
	}
	
	constructor(props) {
		super(props);
		this.state = YCursor.defaultState;
	}
	
	componentDidMount() {
		var pane = d3.select(this.pane)
			.on('mousemove', this.onMouseMove)
			.call(this.props.zoom);
	}
	
	componentWillUnmount() {
		d3.select(this.pane).on('mousemove', null);
	}
	
	private get cursor() {
		if (this.state.mouseY) {
			return (
				<g
					className='y cursor'
					transform={'translate(0, ' + this.state.mouseY + ')'}>
					<line x2={this.props.width} />
					<rect x={this.props.width} y={-7} width={50} height={14} />
					<text dy='.32em' x={this.props.width + 3}>{this.label}</text>
				</g>
			);
		}
	}
	
	render() {
		return (
			<g>
				{this.cursor}
				<rect
					className='pane'
					ref={ref => this.pane = ref}
					width={this.props.width}
					height={this.props.height}
					onMouseOut={this.onMouseOut} />
			</g>
		);
	}
	
	private onMouseMove = () => {
		var mouse = d3.mouse(this.pane);
		CursorActions.move(mouse);
		this.setState({ mouseY: mouse[1] });
	}
	
	private onMouseOut = () => {
		CursorActions.hide();
		this.setState(YCursor.defaultState);
	}
}

module YCursor {
	export interface Props {
		width: number;
		height: number;
		scale: d3.scale.Linear<number, number>;
		zoom: d3.behavior.Zoom<{}>;
		labelFormat: (t: any) => string;
	}
	
	export interface State {
		mouseY: number;
	}
	
	export var defaultState = {
		mouseY: undefined
	}
}

export = YCursor;