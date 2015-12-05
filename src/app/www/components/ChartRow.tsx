/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import SeriesProps = require('./common/SeriesProps');

import YAxis = require('./YAxis');

class ChartRow extends React.Component<ChartRow.Props, {}> {
	
	private yScale = d3.scale.linear();
	
	private get series() {
		return React.Children.map(this.props.children,
			(child: React.ReactElement<SeriesProps>) => (
				React.cloneElement(child, {
					xScale: this.props.xScale,
					yScale: this.yScale,
					clipPath: this.props.clipPath
				})
			)
		);
	}
	
	render() {
		this.updateYScale();
		return (
			<g transform={'translate(0, ' + this.props.y + ')'}>
				<text className='mdl-typography--title mdl-color-text--grey-700'>
					{this.props.title}
				</text>
				{React.createElement('clipPath', { id: this.props.clipPath },
					<rect width={this.props.width} height={this.props.height} />
				) /* TSX doesn't know clipPath element */}
				{this.series}
				<YAxis
					width={this.props.width}
					height={this.props.height}
					scale={this.yScale}
					zoom={this.props.zoom}
					clipPath={this.props.clipPath + 'Axis'}
					tickFormat={this.props.yTickFormat} />
			</g>
		);
	}
	
	private updateYScale<T>() {
		var bisect = d3.bisector(this.props.xAccessor).left,
			domain = this.props.xScale.domain(),
			i = bisect(this.props.data, domain[0], 1),
			j = bisect(this.props.data, domain[1], i + 1),
			domainData = this.props.data.slice(i - 1, j + 1),
			extent = d3.extent(domainData, this.props.yAccessor);
		
		this.yScale.range([this.props.height, 0]);
		if (extent[0] != extent[1]) {
			var padding = this.props.yDomainPadding * (extent[1] - extent[0]);
			this.yScale.domain([extent[0] - padding, extent[1] + padding]);
		}
	}
}

module ChartRow {
	export interface Props {
		title: string;
		data: {}[];
		xAccessor: (d: {}) => Date;
		yAccessor: (d: {}) => number;
		y: number;
		width: number;
		height: number;
		xScale: d3.time.Scale<Date, number>;
		zoom: d3.behavior.Zoom<{}>;
		clipPath: string;
		yTickFormat: (t: any) => string;
		yDomainPadding: number;
		children?: React.ReactNode;
	}
}

export = ChartRow;