/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Margin = require('./common/Margin');

import XAxis = require('./XAxis');
import YAxis = require('./YAxis');
import LineSeries = require('./LineSeries');
import Cursor = require('./Cursor');

class Chart extends React.Component<Chart.Props, Chart.State> {
	
	private yScale = d3.scale.linear();
	
	render() {
		var margin = this.props.margin,
			contentWidth = this.props.width - margin.left - margin.right,
			contentHeight = this.props.height - margin.top - margin.bottom;
		
		this.updateYScale(contentHeight);
		
		return (
			<div className='chart'>
				<div className='mdl-typography--title mdl-color-text--grey-700'>
					{this.props.title}
				</div>
				<svg width={this.props.width} height={this.props.height}>
					<g transform={'translate(' + margin.left + ', ' + margin.top + ')'}>
						{React.createElement('clipPath', {id: 'clip'},
							<rect width={contentWidth} height={contentHeight} />
						) /* TSX doesn't know clipPath element */}
						<XAxis
							height={contentHeight}
							scale={this.props.xScale} />
						<YAxis
							width={contentWidth}
							scale={this.yScale}
							tickFormat={this.props.yTickFormat} />
						<LineSeries
							data={this.props.data}
							xAccessor={this.props.xAccessor}
							yAccessor={this.props.yAccessor}
							xScale={this.props.xScale}
							yScale={this.yScale}
							clipPath='url(#clip)' />
						<Cursor
							data={this.props.data}
							xAccessor={this.props.xAccessor}
							width={contentWidth}
							height={contentHeight}
							xScale={this.props.xScale}
							yScale={this.yScale}
							zoom={this.props.zoom} />
					</g>
				</svg>
			</div>
		);
	}
	
	private updateYScale(height: number) {
		var bisect = d3.bisector(this.props.xAccessor).left,
			domain = this.props.xScale.domain(),
			i = bisect(this.props.data, domain[0], 1),
			j = bisect(this.props.data, domain[1], i + 1),
			domainData = this.props.data.slice(i - 1, j + 1),
			extent = d3.extent(domainData, this.props.yAccessor);
		
		this.yScale.range([height, 0]);
		if (extent[0] != extent[1]) {
			var padding = this.props.yDomainPadding * (extent[1] - extent[0]);
			this.yScale.domain([extent[0] - padding, extent[1] + padding]).nice();
		}
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
		yTickFormat: (t: any) => string;
		zoom: d3.behavior.Zoom<{}>;
		title?: string;
		yDomainPadding?: number;
	}
	
	export var defaultProps: Props = {
		data: undefined,
		xAccessor: undefined,
		yAccessor: undefined,
		width: undefined,
		height: undefined,
		margin: undefined,
		xScale: undefined,
		yTickFormat: undefined,
		zoom: undefined,
		yDomainPadding: 0.1
	}
	
	export interface State {
	}
}

export = Chart;