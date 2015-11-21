/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Margin = require('./common/Margin');
import ChartConstants = require('../constants/ChartConstants');

import XAxis = require('./XAxis');
import YAxis = require('./YAxis');
import LineSeries = require('./LineSeries');
import Cursor = require('./Cursor');

class Chart extends React.Component<Chart.Props, Chart.State> {	
	render() {
		var margin = this.props.margin,
			contentWidth = this.props.width - margin.left - margin.right,
			contentHeight = this.props.height - margin.top - margin.bottom;
		
		return (
			<div className='chart'>
				<div className='mdl-typography--title mdl-color-text--grey-700'>
					{this.props.title}
				</div>
				<svg width={this.props.width} height={this.props.height}>
					<g transform={'translate(' + margin.left + ', ' + margin.top + ')'}>
						{React.createElement('clipPath', {id: ChartConstants.clipPath},
							<rect width={contentWidth} height={contentHeight} />
						) /* TSX doesn't know clipPath element */}
						<XAxis
							height={contentHeight}
							scale={this.props.xScale} />
						<YAxis
							width={contentWidth}
							scale={this.props.yScale}
							tickFormat={this.props.yTickFormat} />
						<LineSeries
							data={this.props.data}
							xAccessor={this.props.xAccessor}
							yAccessor={this.props.yAccessor}
							xScale={this.props.xScale}
							yScale={this.props.yScale} />
						{this.props.children}
						<Cursor
							data={this.props.data}
							xAccessor={this.props.xAccessor}
							width={contentWidth}
							height={contentHeight}
							xScale={this.props.xScale}
							yScale={this.props.yScale}
							zoom={this.props.zoom} />
					</g>
				</svg>
			</div>
		);
	}
}

module Chart {
	export interface Props {
		data: {}[];
		xAccessor: (d: {}) => Date;
		yAccessor: (d: {}) => number;
		width: number;
		height: number;
		margin: Margin;
		xScale: d3.time.Scale<Date, number>;
		yScale: d3.scale.Linear<number, number>;
		yTickFormat: (t: any) => string;
		zoom: d3.behavior.Zoom<{}>;
		children?: React.ReactNode;
		title?: string;
	}
	
	export interface State {
	}
}

export = Chart;