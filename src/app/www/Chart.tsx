/// <reference path="../../../typings/tsd.d.ts" />

import d3 = require('d3');
import React = require('react');
import ReactDOM = require('react-dom');

class Chart extends React.Component<Chart.Props, Chart.State> {
	
	x = d3.time.scale<number, Date>();
	y = d3.scale.linear();
	
	xAxis = d3.svg.axis()
		.scale(this.x)
		.tickFormat(d3.time.format.multi([
			['.%L', function(d) { return d.getMilliseconds(); }],
			[':%S', function(d) { return d.getSeconds(); }],
			['%H:%M', function(d) { return d.getMinutes(); }],
			['%H:%M', function(d) { return d.getHours(); }],
			['%a %d', function(d) { return d.getDay() && d.getDate() != 1; }],
			['%b %d', function(d) { return d.getDate() != 1; }],
			['%B', function(d) { return d.getMonth(); }],
			['%Y', function() { return true; }]
		]))
		.orient('bottom');
		
	yAxis = d3.svg.axis()
		.scale(this.y)
		.tickFormat(d3.format(',.5f'))
		.orient('right');
	
	render() {
		var {width, height, marginTop, marginRight, marginBottom, marginLeft} = this.props;
		
		this.x.range([0, width]);
        this.y.range([height, 0]);
        
        this.xAxis.tickSize(-height, 0);
        this.yAxis.tickSize(-width, 0);
		
		return (
			<svg
				width={width + marginLeft + marginRight}
				height={height + marginTop + marginBottom}>
				<g transform={'translate(' + marginLeft + ', ' + marginTop + ')'}>
					<g
						className="x axis" transform={'translate(0, ' + height + ')'}
						ref={(ref: any) => this.xAxis(d3.select(ref))} />
					<g
						className="y axis" transform={'translate(' + width + ', 0)'}
						ref={(ref: any) => this.yAxis(d3.select(ref))} />
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

ReactDOM.render(<Chart width={800} height={600} />, document.getElementById('chart'));