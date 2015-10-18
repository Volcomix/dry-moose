/// <reference path="../../../typings/tsd.d.ts" />

import d3 = require('d3');
import React = require('react');

import TimeFormat = require('./TimeFormat');

class Chart extends React.Component<Chart.Props, Chart.State> {
	
	private x = d3.time.scale<number, Date>();
	private y = d3.scale.linear();
	
	private xAxis = d3.svg.axis()
		.scale(this.x)
		.tickFormat(TimeFormat.multi())
		.orient('bottom');
		
	private yAxis = d3.svg.axis()
		.scale(this.y)
		.tickFormat(d3.format(',.5f'))
		.orient('right');
	
	render() {
		var {width, height, marginTop, marginRight, marginBottom, marginLeft} = this.props;
		
		var innerWidth = width - marginLeft - marginRight;
		var innerHeight = height - marginTop - marginBottom;
		
		this.x.range([0, innerWidth]);
        this.y.range([innerHeight, 0]);
        
        this.xAxis.tickSize(-innerHeight, 0);
        this.yAxis.tickSize(-innerWidth, 0);
		
		return (
			<svg width={width} height={height}>
				<g transform={'translate(' + marginLeft + ', ' + marginTop + ')'}>
					<g
						className="x axis" transform={'translate(0, ' + innerHeight + ')'}
						ref={(ref: any) => d3.select(ref).call(this.xAxis)} />
					<g
						className="y axis" transform={'translate(' + innerWidth + ', 0)'}
						ref={(ref: any) => d3.select(ref).call(this.yAxis)} />
				</g>
			</svg>
		);
	}
}

module Chart {
	export interface Props {
		width: number;
		height: number;
		marginTop?: number;
		marginRight?: number;
		marginBottom?: number;
		marginLeft?: number;
	}

	export var defaultProps = {
		marginTop: 20,
		marginRight: 50,
		marginBottom: 30,
		marginLeft: 20
	}
  
	export interface State {
	}
}

export = Chart;