/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import YAxis = require('./YAxis');

class ChartRow extends React.Component<ChartRow.Props, {}> {
	render() {
		return (
			<g className='quotes' transform={'translate(0, ' + this.props.y + ')'}>
				<text className='mdl-typography--title mdl-color-text--grey-700'>
					{this.props.title}
				</text>
				{React.createElement('clipPath', { id: this.props.clipPath },
					<rect width={this.props.width} height={this.props.height} />
				) /* TSX doesn't know clipPath element */}
				{this.props.children}
				<YAxis
					width={this.props.width}
					height={this.props.height}
					scale={this.props.yScale}
					zoom={this.props.zoom}
					clipPath={this.props.clipPath + 'Axis'}
					tickFormat={this.props.yTickFormat} />
			</g>
		);
	}
}

module ChartRow {
	export interface Props {
		title: string;
		y: number;
		width: number;
		height: number;
		yScale: d3.scale.Linear<number, number>;
		zoom: d3.behavior.Zoom<{}>;
		clipPath: string;
		yTickFormat: (t: any) => string;
		children?: React.ReactNode;
	}
}

export = ChartRow;