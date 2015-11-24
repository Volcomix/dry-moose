/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

class YAxis extends React.Component<YAxis.Props, {}> {
	
	private static domainPadding = 0.1;
	
	private axis = d3.svg.axis().orient('right');
	
	constructor(props) {
		super(props);
		this.axis
			.tickFormat(this.props.tickFormat)
			.scale(this.props.yScale);
	}
	
	render() {
		this.updateYScale();
		this.axis.tickSize(-this.props.width, 0);
		return (
			<g
				className='y axis'
				transform={'translate(' + this.props.width + ', 0)'}
				ref={(ref: any) => d3.select(ref).call(this.axis)} />
		);
	}
	
	private updateYScale() {
		var bisect = d3.bisector(this.props.xAccessor).left,
			domain = this.props.xScale.domain(),
			i = bisect(this.props.data, domain[0], 1),
			j = bisect(this.props.data, domain[1], i + 1),
			domainData = this.props.data.slice(i - 1, j + 1),
			extent = d3.extent(domainData, this.props.yAccessor);
		
		this.props.yScale.range([this.props.height, 0]);
		if (extent[0] != extent[1]) {
			var padding = YAxis.domainPadding * (extent[1] - extent[0]);
			this.props.yScale.domain([extent[0] - padding, extent[1] + padding]).nice();
		}
	}
}

module YAxis {
	export interface Props {
		data: {}[];
		xAccessor: (d: {}) => Date;
		yAccessor: (d: {}) => number;
		width: number;
		height: number;
		xScale: d3.time.Scale<Date, number>;
		yScale: d3.scale.Linear<number, number>;
		tickFormat: (t: any) => string;
	}
}

export = YAxis;