/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Margin = require('./common/Margin');

import Divider = require('./Divider');

class ChartRows extends React.Component<ChartRows.Props, {}> {
	
	private drag = d3.behavior.drag<Divider.Datum>().origin(d => d);
	
	componentDidMount() {
		this.drag.on('drag', this.onDrag);
	}
	
	componentWillUnmount() {
		this.drag.on('drag', null);
	}
	
	render() {
		var margin = this.props.margin;
		return (
			<g transform={'translate(' + margin.left + ', ' + margin.top + ')'}>
				{this.props.children}
				{this.props.dividers.map((ratio, id) => {
					return (
						<Divider
							key={id}
							id={id}
							y={Math.round(this.props.height * ratio)}
							width={this.props.width + this.props.margin.right}
							drag={this.drag} />
					);
				})}
			</g>
		);
	}
	
	private onDrag = (d: Divider.Datum) => {
		var event = d3.event as d3.DragEvent,
			height = this.props.height,
			dividers = this.props.dividers,
			min = d.id ? dividers[d.id - 1] : 0,
			max = (d.id == dividers.length - 1) ? 1 : dividers[d.id + 1];
		dividers[d.id] = Math.min(Math.max(event.y / height, min + 0.1), max - 0.1);
		this.props.onDividerDrag(dividers);
	}
}

module ChartRows {
	export interface Props {
		width: number;
		height: number;
		margin: Margin;
		dividers: number[];
		onDividerDrag: (dividers: number[]) => void;
		children?: React.ReactNode;
	}
}

export = ChartRows;